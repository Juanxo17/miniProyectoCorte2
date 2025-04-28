import { createContext, useState, useEffect } from 'react';
import { initialBooks } from '../data/initialBooks';
import { LinkedList } from '../Utils/LinkedList';
import { Queue } from '../Utils/Queue';
import { Stack } from '../Utils/pila';

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [bookCatalog] = useState(() => {
    const catalog = new LinkedList();
    initialBooks.forEach(book => catalog.append({...book, category: getCategoryForBook(book.title)}));
    return catalog;
  });

  const [borrowedBooks, setBorrowedBooks] = useState([]);

  const [returnedBooks] = useState(() => new Stack());

  const [waitingQueues, setWaitingQueues] = useState({});

  const [updateTrigger, setUpdateTrigger] = useState(0);

  function getCategoryForBook(title) {
    if (title.includes("Potter") || title.includes("anillos")) return "Fantasía";
    if (title.includes("1984")) return "Ciencia Ficción";
    if (title.includes("Quijote")) return "Clásicos";
    return "Literatura";
  }

  const forceUpdate = () => setUpdateTrigger(prev => prev + 1);

  const borrowBook = (book, userName) => {
    if (!book.available) {
      const newWaitingQueues = {...waitingQueues};
      
      if (!newWaitingQueues[book.id]) {
        newWaitingQueues[book.id] = new Queue();
      }
      
      newWaitingQueues[book.id].enqueue({ userName, date: new Date() });
      setWaitingQueues(newWaitingQueues);
      forceUpdate();
      return false;
    }

    book.available = false;
    book.borrowedBy = userName;
    book.borrowDate = new Date();
    
    setBorrowedBooks(prev => [...prev, {...book}]);
    
    bookCatalog.remove(book);
    
    forceUpdate();
    return true;
  };

  const returnBook = (book) => {
    const bookId = book.id;
    
    if (waitingQueues[bookId] && !waitingQueues[bookId].isEmpty()) {
      const nextUser = waitingQueues[bookId].dequeue();
      
      book.borrowedBy = nextUser.userName;
      book.borrowDate = new Date();
      
      setBorrowedBooks(prev => {
        const updatedBooks = prev.filter(b => b.id !== book.id);
        return [...updatedBooks, {...book}];
      });
      
      if (waitingQueues[bookId].isEmpty()) {
        const newQueues = {...waitingQueues};
        delete newQueues[bookId];
        setWaitingQueues(newQueues);
      } else {
        const newQueues = {...waitingQueues};
        setWaitingQueues(newQueues);
      }
      
      alert(`Libro "${book.title}" prestado automáticamente a ${nextUser.userName}`);
    } else {
      const returnedBook = {...book, returnDate: new Date()};
      returnedBooks.push(returnedBook);
      
      setBorrowedBooks(prev => prev.filter(b => b.id !== book.id));
    }
    
    forceUpdate();
  };

  const restoreBook = () => {
    const book = returnedBooks.pop();
    if (book) {
      book.available = true;
      book.borrowedBy = null;
      book.borrowDate = null;
      delete book.returnDate;
      
      bookCatalog.append(book);
      forceUpdate();
      return book;
    }
    return null;
  };

  const getBooksWithQueues = () => {
    const booksWithQueues = [];
    
    Object.keys(waitingQueues).forEach(bookId => {
      const book = borrowedBooks.find(b => b.id.toString() === bookId);
      if (book && !waitingQueues[bookId].isEmpty()) {
        const queueArray = [];
        const tempQueue = new Queue();
        
        while (!waitingQueues[bookId].isEmpty()) {
          const user = waitingQueues[bookId].dequeue();
          queueArray.push(user);
          tempQueue.enqueue(user);
        }
        
        while (!tempQueue.isEmpty()) {
          waitingQueues[bookId].enqueue(tempQueue.dequeue());
        }
        
        booksWithQueues.push({
          book,
          users: queueArray
        });
      }
    });
    
    return booksWithQueues;
  };

  return (
    <LibraryContext.Provider
      value={{
        bookCatalog,
        borrowedBooks,
        returnedBooks,
        waitingQueues,
        setWaitingQueues,
        borrowBook,
        returnBook,
        restoreBook,
        getBooksWithQueues,
        updateTrigger,
        forceUpdate
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
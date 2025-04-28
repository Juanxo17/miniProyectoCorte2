import { useContext, useState, useEffect } from 'react';
import { LibraryContext } from '../context/LibraryContext';
import { Queue } from '../Utils/Queue';

const BookCatalog = () => {
  const { 
    bookCatalog, 
    borrowedBooks, 
    borrowBook, 
    returnBook, 
    updateTrigger, 
    waitingQueues,
    setWaitingQueues,
    forceUpdate 
  } = useContext(LibraryContext);
  
  const [userName, setUserName] = useState('');
  const [queueUserName, setQueueUserName] = useState(''); 
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBorrowedBook, setSelectedBorrowedBook] = useState(null);
  const [activeTab, setActiveTab] = useState('available');
  
  useEffect(() => {
    setSelectedBook(null);
    setSelectedBorrowedBook(null);
  }, [activeTab]);
  
  const getAvailableBooks = () => {
    const books = [];
    let current = bookCatalog.head;
    
    while (current) {
      books.push(current.value);
      current = current.next;
    }
    
    return books;
  };

  const handleBorrow = () => {
    if (!selectedBook) {
      alert('Por favor, selecciona un libro');
      return;
    }
    
    if (!userName.trim()) {
      alert('Por favor, ingresa un nombre de usuario');
      return;
    }
    
    const success = borrowBook(selectedBook, userName);
    
    if (success) {
      alert(`Libro "${selectedBook.title}" prestado a ${userName}`);
      setSelectedBook(null);
      setUserName('');
    } else {
      alert(`El libro "${selectedBook.title}" no está disponible. Has sido añadido a la cola de espera.`);
    }
  };

  const handleReturn = (book) => {
    if (window.confirm(`¿Deseas devolver el libro "${book.title}"?`)) {
      returnBook(book);
      alert(`Libro "${book.title}" devuelto correctamente.`);
    }
  };
  
  const handleJoinQueue = () => {
    if (!selectedBorrowedBook) {
      alert('Por favor, selecciona un libro prestado');
      return;
    }
    
    if (!queueUserName.trim()) {
      alert('Por favor, ingresa un nombre de usuario para la cola');
      return;
    }
    
    const newQueues = {...waitingQueues};
    
    if (!newQueues[selectedBorrowedBook.id]) {
      newQueues[selectedBorrowedBook.id] = new Queue();
    }
    
    newQueues[selectedBorrowedBook.id].enqueue({ 
      userName: queueUserName, 
      date: new Date() 
    });
    
    setWaitingQueues(newQueues);
    
    forceUpdate();
    
    alert(`Te has unido a la cola de espera para el libro "${selectedBorrowedBook.title}"`);
    setQueueUserName('');
    setSelectedBorrowedBook(null);
  };

  return (
    <div className="catalog-container">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'available' ? 'active' : ''}`} 
          onClick={() => setActiveTab('available')}
        >
          Libros Disponibles ({getAvailableBooks().length})
        </button>
        <button 
          className={`tab ${activeTab === 'borrowed' ? 'active' : ''}`} 
          onClick={() => setActiveTab('borrowed')}
        >
          Libros Prestados ({borrowedBooks.length})
        </button>
      </div>

      {activeTab === 'available' ? (
        <>
          <div className="book-list">
            {getAvailableBooks().length > 0 ? (
              getAvailableBooks().map((book) => (
                <div 
                  key={book.id} 
                  className={`book-item ${selectedBook?.id === book.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBook(book)}
                >
                  <h3>{book.title}</h3>
                  <p>Autor: {book.author}</p>
                  <p>Categoría: {book.category || "General"}</p>
                  <p className="status">Estado: {book.available !== false ? 'Disponible' : 'Prestado'}</p>
                </div>
              ))
            ) : (
              <p className="empty-message">No hay libros disponibles en el catálogo</p>
            )}
          </div>

          {getAvailableBooks().length > 0 && (
            <div className="borrow-form">
              <h3>Prestar un libro</h3>
              <div className="form-group">
                <label>Libro seleccionado:</label>
                <p>{selectedBook ? selectedBook.title : 'Ninguno seleccionado'}</p>
              </div>
              <div className="form-group">
                <label htmlFor="userName">Nombre del usuario:</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ingresa el nombre del usuario"
                />
              </div>
              <button 
                className="borrow-button" 
                onClick={handleBorrow}
                disabled={!selectedBook}
              >
                Prestar libro
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="book-list">
            {borrowedBooks.length > 0 ? (
              borrowedBooks.map((book) => (
                <div 
                  key={book.id} 
                  className={`book-item borrowed ${selectedBorrowedBook?.id === book.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBorrowedBook(book)}
                >
                  <h3>{book.title}</h3>
                  <p>Autor: {book.author}</p>
                  <p>Categoría: {book.category || "General"}</p>
                  <p className="borrower"><strong>Prestado a:</strong> {book.borrowedBy}</p>
                  <p className="borrow-date"><strong>Fecha de préstamo:</strong> {book.borrowDate ? new Date(book.borrowDate).toLocaleDateString() : 'N/A'}</p>
                  <button 
                    className="return-button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReturn(book);
                    }}
                  >
                    Devolver libro
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-message">No hay libros prestados actualmente</p>
            )}
          </div>
          
          {borrowedBooks.length > 0 && (
            <div className="queue-form">
              <h3>Unirse a la cola de espera</h3>
              <div className="form-group">
                <label>Libro prestado seleccionado:</label>
                <p>{selectedBorrowedBook ? selectedBorrowedBook.title : 'Ninguno seleccionado'}</p>
              </div>
              <div className="form-group">
                <label htmlFor="queueUserName">Nombre del usuario:</label>
                <input
                  type="text"
                  id="queueUserName"
                  value={queueUserName}
                  onChange={(e) => setQueueUserName(e.target.value)}
                  placeholder="Ingresa tu nombre para la cola de espera"
                />
              </div>
              <button 
                className="queue-button" 
                onClick={handleJoinQueue}
                disabled={!selectedBorrowedBook}
              >
                Unirse a la cola de espera
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookCatalog;
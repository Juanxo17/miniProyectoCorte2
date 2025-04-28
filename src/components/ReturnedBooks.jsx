import { useContext } from 'react';
import { LibraryContext } from '../context/LibraryContext';

const ReturnedBooks = () => {
  const { returnedBooks, restoreBook, updateTrigger } = useContext(LibraryContext);

  const getReturnedBooks = () => {
    return [...returnedBooks.items].reverse();
  };

  const handleRestore = () => {
    const book = restoreBook();
    if (book) {
      alert(`Libro "${book.title}" restaurado al catálogo`);
    } else {
      alert('No hay libros para restaurar');
    }
  };

  return (
    <div className="returned-books-container">
      <h2>Historial de Devoluciones</h2>
      
      <div className="stack-visualization">
        {getReturnedBooks().length > 0 ? (
          getReturnedBooks().map((book, index) => (
            <div key={`${book.id}-${index}`} className="stack-item">
              {book.title} - {book.author}
            </div>
          ))
        ) : (
          <p className="empty-message">No hay libros en la pila de devoluciones</p>
        )}
      </div>
      
      <div className="returned-books-list">
        {getReturnedBooks().length > 0 ? (
          getReturnedBooks().map((book, index) => (
            <div key={`${book.id}-${index}`} className="returned-book-item">
              <h3>{book.title}</h3>
              <p>Autor: {book.author}</p>
              <p>Categoría: {book.category || "General"}</p>
              {book.returnDate && (
                <p><strong>Fecha de devolución:</strong> {new Date(book.returnDate).toLocaleDateString()}</p>
              )}
              <p><strong>Prestado por última vez a:</strong> {book.borrowedBy}</p>
            </div>
          ))
        ) : null}
      </div>
      
      <button 
        className="restore-button" 
        onClick={handleRestore}
        disabled={returnedBooks.size() === 0}
      >
        Restaurar último libro devuelto al catálogo
      </button>
    </div>
  );
};

export default ReturnedBooks;
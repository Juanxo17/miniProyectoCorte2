import { useContext, useEffect, useState } from 'react';
import { LibraryContext } from '../context/LibraryContext';

const WaitingQueue = () => {
  const { getBooksWithQueues, updateTrigger, waitingQueues } = useContext(LibraryContext);
  const [queuedBooks, setQueuedBooks] = useState([]);
  
  useEffect(() => {
    setQueuedBooks(getBooksWithQueues());
  }, [updateTrigger, waitingQueues, getBooksWithQueues]);

  return (
    <div className="waiting-queue-container">
      <h2>Cola de Espera por Libro</h2>
      
      {queuedBooks.length > 0 ? (
        <div className="waiting-queue-list">
          {queuedBooks.map(({ book, users }) => (
            <div key={book.id} className="waiting-queue-item">
              <h3>Libro: {book.title}</h3>
              <p>Autor: {book.author}</p>
              <p><strong>Actualmente prestado a:</strong> {book.borrowedBy}</p>
              
              <div className="queue-visualization">
                <h4>Usuarios en espera:</h4>
                <ol>
                  {users.map((user, index) => (
                    <li key={index} className="queue-user">
                      {user.userName}
                      {index === 0 && <span className="next-badge"> (Siguiente)</span>}
                      <div className="queue-date">
                        {user.date ? new Date(user.date).toLocaleDateString() : 'N/A'}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">No hay usuarios en cola de espera</p>
      )}
    </div>
  );
};

export default WaitingQueue;
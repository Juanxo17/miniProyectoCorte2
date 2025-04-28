import { LibraryProvider } from './context/LibraryContext';
import BookCatalog from './components/BookCatalog';
import ReturnedBooks from './components/ReturnedBooks';
import WaitingQueue from './components/WaitingQueue';
import './styles/library.css';

function App() {
  return (
    <LibraryProvider>
      <div className="library-container">
        <h1>Biblioteca Virtual Interactiva</h1>
        <p className="subtitle">Implementación con estructuras de datos: Lista enlazada, Pila y Cola</p>
        
        <section>
          <h2>Catálogo de Libros (Lista)</h2>
          <BookCatalog />
        </section>

        <section>
          <ReturnedBooks />
        </section>

        <section>
          <WaitingQueue />
        </section>
      </div>
    </LibraryProvider>
  );
}

export default App;
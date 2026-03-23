import { Navigate } from 'react-router-dom';
import { useAutoryzacja } from '../contexts/KontekstAutoryzacji';
import { Spinner, Container } from 'react-bootstrap';

export default function TrasaPrywatna({ children }) {
  const { uzytkownik, ladowanie } = useAutoryzacja();

  if (ladowanie) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="light" />
          <p className="mt-3 text-muted">Ładowanie...</p>
        </div>
      </Container>
    );
  }

  if (!uzytkownik) {
    return <Navigate to="/logowanie" />;
  }

  return children;
}

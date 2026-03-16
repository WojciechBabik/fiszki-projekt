import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAutoryzacja } from '../contexts/KontekstAutoryzacji';

export default function PasekNawigacji() {
  const { uzytkownik, wylogowanie } = useAutoryzacja();
  const nawiguj = useNavigate();

  async function obsluzWylogowanie() {
    try {
      await wylogowanie();
      nawiguj('/logowanie');
    } catch (blad) {
      console.error('Błąd wylogowania:', blad);
    }
  }

  return (
    <Navbar expand="lg" className="pasek-nawigacji" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand onClick={() => nawiguj('/')} className="marka-nawigacji" role="button">
          <i className="bi bi-stack me-2"></i>
          Fiszki
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nawigacja-glowna" />
        <Navbar.Collapse id="nawigacja-glowna">
          <Nav className="me-auto">
            <Nav.Link onClick={() => nawiguj('/')}>
              <i className="bi bi-house-door me-1"></i>Pulpit
            </Nav.Link>
            {uzytkownik && (
              <Nav.Link onClick={() => nawiguj('/progres')}>
                <i className="bi bi-graph-up-arrow me-1"></i>Statystyki
              </Nav.Link>
            )}
          </Nav>
          {uzytkownik && (
            <div className="d-flex align-items-center gap-3">
              <span className="email-uzytkownika">
                <i className="bi bi-person-circle me-1"></i>
                {uzytkownik.email}
              </span>
              <Button variant="outline-light" size="sm" onClick={obsluzWylogowanie} className="przycisk-wyloguj">
                <i className="bi bi-box-arrow-right me-1"></i>Wyloguj
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

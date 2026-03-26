import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useAutoryzacja } from '../contexts/KontekstAutoryzacji';
import { pobierzTalie, dodajTalie, usunTalie, policzFiszki } from '../services/serwisFirestore';
import KartaTalii from '../components/KartaTalii';

export default function StronaPulpitu() {
  const { uzytkownik } = useAutoryzacja();
  const [talie, ustawTalie] = useState([]);
  const [liczbyFiszek, ustawLiczbyFiszek] = useState({});
  const [ladowanie, ustawLadowanie] = useState(true);
  const [blad, ustawBlad] = useState('');
  const [pokazModal, ustawPokazModal] = useState(false);
  const [nowaNazwa, ustawNowaNazwa] = useState('');
  const [nowyOpis, ustawNowyOpis] = useState('');
  const [dodawanie, ustawDodawanie] = useState(false);
  const [pokazModalUsun, ustawPokazModalUsun] = useState(false);
  const [taliaDoUsuniecia, ustawTaliaDoUsuniecia] = useState(null);
  const [usuwanie, ustawUsuwanie] = useState(false);

  useEffect(() => { zaladujTalie(); }, [uzytkownik]);

  async function zaladujTalie() {
    ustawLadowanie(true);
    try {
      const dane = await pobierzTalie(uzytkownik.uid);
      ustawTalie(dane);
      const liczby = {};
      for (const talia of dane) {
        liczby[talia.id] = await policzFiszki(uzytkownik.uid, talia.id);
      }
      ustawLiczbyFiszek(liczby);

    } catch (err) {
      console.error(err);
      ustawBlad('Nie udało się załadować talii. Sprawdź konfigurację Firebase.');
    }
    ustawLadowanie(false);
  }

  async function obsluzDodajTalie(e) {
    e.preventDefault();
    if (!nowaNazwa.trim()) return;
    ustawDodawanie(true);
    try {
      await dodajTalie(uzytkownik.uid, { nazwa: nowaNazwa.trim(), opis: nowyOpis.trim() });
      ustawNowaNazwa('');
      ustawNowyOpis('');
      ustawPokazModal(false);
      await zaladujTalie();
    } catch (err) {
      console.error(err);
      ustawBlad('Nie udało się dodać talii.');
    }
    ustawDodawanie(false);
  }

  function potwierdzenieUsuniecia(idTalii, nazwaTalii) {
    ustawTaliaDoUsuniecia({ id: idTalii, nazwa: nazwaTalii });
    ustawPokazModalUsun(true);
  }

  async function obsluzUsunTalie() {
    if (!taliaDoUsuniecia) return;
    ustawUsuwanie(true);
    try {
      await usunTalie(uzytkownik.uid, taliaDoUsuniecia.id);
      ustawPokazModalUsun(false);
      ustawTaliaDoUsuniecia(null);
      await zaladujTalie();
    } catch (err) {
      console.error(err);
      ustawBlad('Nie udało się usunąć talii.');
    }
    ustawUsuwanie(false);
  }

  if (ladowanie) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="light" />
          <p className="mt-3 text-muted">Ładowanie talii...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="tytul-strony">
            <i className="bi bi-collection me-2"></i>Twoje talie
          </h2>
          <p className="text-muted mb-0">
            {talie.length === 0
              ? 'Nie masz jeszcze żadnych talii. Utwórz pierwszą!'
              : `Masz ${talie.length} ${talie.length === 1 ? 'talię' : talie.length < 5 ? 'talie' : 'talii'}`}
          </p>
        </div>
        <Button className="przycisk-glowny" onClick={() => ustawPokazModal(true)}>
          <i className="bi bi-plus-lg me-1"></i>Nowa talia
        </Button>
      </div>

      {blad && (
        <Alert variant="danger" dismissible onClose={() => ustawBlad('')}>
          <i className="bi bi-exclamation-triangle me-2"></i>{blad}
        </Alert>
      )}

      {talie.length === 0 ? (
        <div className="puste-talie text-center py-5">
          <i className="bi bi-inbox ikona-pusta"></i>
          <h4 className="mt-3">Brak talii</h4>
          <p className="text-muted">Kliknij "Nowa talia" aby utworzyć swoją pierwszą talię fiszek.</p>
          <Button className="przycisk-glowny" onClick={() => ustawPokazModal(true)}>
            <i className="bi bi-plus-lg me-1"></i>Utwórz pierwszą talię
          </Button>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {talie.map((talia) => (
            <Col key={talia.id}>
              <KartaTalii talia={talia} liczbaFiszek={liczbyFiszek[talia.id] || 0} naUsun={potwierdzenieUsuniecia} />
            </Col>
          ))}
        </Row>
      )}

      <Modal show={pokazModal} onHide={() => ustawPokazModal(false)} centered className="modal-fiszki">
        <Modal.Header closeButton>
          <Modal.Title><i className="bi bi-plus-circle me-2"></i>Nowa talia</Modal.Title>
        </Modal.Header>
        <Form onSubmit={obsluzDodajTalie}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nazwa talii</Form.Label>
              <Form.Control type="text" placeholder="np. Angielski — Słówka" value={nowaNazwa} onChange={(e) => ustawNowaNazwa(e.target.value)} required className="pole-formularza" autoFocus />
            </Form.Group>
            <Form.Group>
              <Form.Label>Opis (opcjonalny)</Form.Label>
              <Form.Control as="textarea" rows={2} placeholder="Krótki opis zawartości talii..." value={nowyOpis} onChange={(e) => ustawNowyOpis(e.target.value)} className="pole-formularza" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => ustawPokazModal(false)}>Anuluj</Button>
            <Button type="submit" className="przycisk-glowny" disabled={dodawanie || !nowaNazwa.trim()}>
              {dodawanie ? <Spinner size="sm" animation="border" className="me-2" /> : <i className="bi bi-plus-lg me-1"></i>}
              Utwórz talię
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={pokazModalUsun} onHide={() => ustawPokazModalUsun(false)} centered className="modal-fiszki">
        <Modal.Header closeButton>
          <Modal.Title><i className="bi bi-exclamation-triangle text-danger me-2"></i>Usuń talię</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Czy na pewno chcesz usunąć talię <strong>"{taliaDoUsuniecia?.nazwa}"</strong>?</p>
          <p className="text-danger mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Ta operacja usunie również wszystkie fiszki w tej talii. Tej akcji nie można cofnąć.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => ustawPokazModalUsun(false)}>Anuluj</Button>
          <Button variant="danger" onClick={obsluzUsunTalie} disabled={usuwanie}>
            {usuwanie ? <Spinner size="sm" animation="border" className="me-2" /> : <i className="bi bi-trash me-1"></i>}
            Usuń
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

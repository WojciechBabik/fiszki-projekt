import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, ListGroup, Spinner, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAutoryzacja } from '../contexts/KontekstAutoryzacji';
import { pobierzTalie1, aktualizujTalie, pobierzFiszki, dodajFiszke, aktualizujFiszke, usunFiszke } from '../services/serwisFirestore';

export default function StronaEdycjiTalii() {
  const { id } = useParams();
  const { uzytkownik } = useAutoryzacja();
  const nawiguj = useNavigate();

  const [talia, ustawTalie] = useState(null);
  const [fiszki, ustawFiszki] = useState([]);
  const [ladowanie, ustawLadowanie] = useState(true);
  const [blad, ustawBlad] = useState('');
  const [sukces, ustawSukces] = useState('');
  const [edycjaNazwy, ustawEdycjaNazwy] = useState('');
  const [edycjaOpisu, ustawEdycjaOpisu] = useState('');
  const [zapisywanieTalii, ustawZapisywanieTalii] = useState(false);
  const [nowyPrzod, ustawNowyPrzod] = useState('');
  const [nowyTyl, ustawNowyTyl] = useState('');
  const [dodawanieFiszki, ustawDodawanieFiszki] = useState(false);
  const [edytowanaFiszkaId, ustawEdytowanaFiszkaId] = useState(null);
  const [edytowanyPrzod, ustawEdytowanyPrzod] = useState('');
  const [edytowanyTyl, ustawEdytowanyTyl] = useState('');

  useEffect(() => { zaladujDane(); }, [id, uzytkownik]);

  async function zaladujDane() {
    ustawLadowanie(true);
    try {
      const daneTalii = await pobierzTalie1(uzytkownik.uid, id);
      if (!daneTalii) { ustawBlad('Nie znaleziono talii.'); ustawLadowanie(false); return; }
      ustawTalie(daneTalii);
      ustawEdycjaNazwy(daneTalii.nazwa);
      ustawEdycjaOpisu(daneTalii.opis || '');
      const daneFiszek = await pobierzFiszki(uzytkownik.uid, id);
      ustawFiszki(daneFiszek);
    } catch (err) {
      console.error(err);
      ustawBlad('Nie udało się załadować danych talii.');
    }
    ustawLadowanie(false);
  }

  async function obsluzZapiszTalie(e) {
    e.preventDefault();
    if (!edycjaNazwy.trim()) return;
    ustawZapisywanieTalii(true);
    try {
      await aktualizujTalie(uzytkownik.uid, id, { nazwa: edycjaNazwy.trim(), opis: edycjaOpisu.trim() });
      ustawSukces('Talia została zaktualizowana.');
      setTimeout(() => ustawSukces(''), 3000);
    } catch (err) {
      console.error(err);
      ustawBlad('Nie udało się zapisać zmian.');
    }
    ustawZapisywanieTalii(false);
  }

  async function obsluzDodajFiszke(e) {
    e.preventDefault();
    if (!nowyPrzod.trim() || !nowyTyl.trim()) return;
    ustawDodawanieFiszki(true);
    try {
      await dodajFiszke(uzytkownik.uid, id, { przod: nowyPrzod.trim(), tyl: nowyTyl.trim() });
      ustawNowyPrzod('');
      ustawNowyTyl('');
      const daneFiszek = await pobierzFiszki(uzytkownik.uid, id);
      ustawFiszki(daneFiszek);
      ustawSukces('Fiszka została dodana.');
      setTimeout(() => ustawSukces(''), 3000);
    } catch (err) {
      console.error(err);
      ustawBlad('Nie udało się dodać fiszki.');
    }
    ustawDodawanieFiszki(false);
  }

  function rozpocznijEdycje(fiszka) {
    ustawEdytowanaFiszkaId(fiszka.id);
    ustawEdytowanyPrzod(fiszka.przod);
    ustawEdytowanyTyl(fiszka.tyl);
  }

  async function obsluzZapiszFiszke() {
    if (!edytowanyPrzod.trim() || !edytowanyTyl.trim()) return;
    try {
      await aktualizujFiszke(uzytkownik.uid, id, edytowanaFiszkaId, { przod: edytowanyPrzod.trim(), tyl: edytowanyTyl.trim() });
      ustawEdytowanaFiszkaId(null);
      const daneFiszek = await pobierzFiszki(uzytkownik.uid, id);
      ustawFiszki(daneFiszek);
      ustawSukces('Fiszka została zaktualizowana.');
      setTimeout(() => ustawSukces(''), 3000);
    } catch (err) {
      console.error(err);
      ustawBlad('Nie udało się zapisać zmian fiszki.');
    }
  }

  async function obsluzUsunFiszke(idFiszki) {
    if (!window.confirm('Czy na pewno chcesz usunąć tę fiszkę?')) return;
    try {
      await usunFiszke(uzytkownik.uid, id, idFiszki);
      const daneFiszek = await pobierzFiszki(uzytkownik.uid, id);
      ustawFiszki(daneFiszek);
      ustawSukces('Fiszka została usunięta.');
      setTimeout(() => ustawSukces(''), 3000);
    } catch (err) {
      console.error(err);
      ustawBlad('Nie udało się usunąć fiszki.');
    }
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

  if (!talia) {
    return (
      <Container className="py-4 text-center">
        <Alert variant="danger"><i className="bi bi-exclamation-triangle me-2"></i>Nie znaleziono talii.</Alert>
        <Button variant="primary" onClick={() => nawiguj('/')}>Wróć do pulpitu</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <Button variant="link" className="przycisk-powrot mb-3 p-0" onClick={() => nawiguj('/')}>
        <i className="bi bi-arrow-left me-1"></i>Wróć do pulpitu
      </Button>

      {blad && <Alert variant="danger" dismissible onClose={() => ustawBlad('')}><i className="bi bi-exclamation-triangle me-2"></i>{blad}</Alert>}
      {sukces && <Alert variant="success" dismissible onClose={() => ustawSukces('')}><i className="bi bi-check-circle me-2"></i>{sukces}</Alert>}

      <Card className="karta-sekcja mb-4">
        <Card.Header className="naglowek-sekcji"><i className="bi bi-gear me-2"></i>Ustawienia talii</Card.Header>
        <Card.Body>
          <Form onSubmit={obsluzZapiszTalie}>
            <Form.Group className="mb-3">
              <Form.Label>Nazwa talii</Form.Label>
              <Form.Control type="text" value={edycjaNazwy} onChange={(e) => ustawEdycjaNazwy(e.target.value)} className="pole-formularza" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Opis</Form.Label>
              <Form.Control as="textarea" rows={2} value={edycjaOpisu} onChange={(e) => ustawEdycjaOpisu(e.target.value)} className="pole-formularza" />
            </Form.Group>
            <Button type="submit" className="przycisk-glowny" disabled={zapisywanieTalii}>
              {zapisywanieTalii ? <Spinner size="sm" animation="border" className="me-2" /> : <i className="bi bi-check-lg me-1"></i>}
              Zapisz zmiany
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="karta-sekcja mb-4">
        <Card.Header className="naglowek-sekcji"><i className="bi bi-plus-circle me-2"></i>Dodaj fiszkę</Card.Header>
        <Card.Body>
          <Form onSubmit={obsluzDodajFiszke}>
            <div className="row g-3">
              <div className="col-md-5">
                <Form.Control type="text" placeholder="Przód (pojęcie)" value={nowyPrzod} onChange={(e) => ustawNowyPrzod(e.target.value)} className="pole-formularza" required />
              </div>
              <div className="col-md-5">
                <Form.Control type="text" placeholder="Tył (definicja)" value={nowyTyl} onChange={(e) => ustawNowyTyl(e.target.value)} className="pole-formularza" required />
              </div>
              <div className="col-md-2">
                <Button type="submit" className="przycisk-glowny w-100" disabled={dodawanieFiszki || !nowyPrzod.trim() || !nowyTyl.trim()}>
                  {dodawanieFiszki ? <Spinner size="sm" animation="border" /> : <i className="bi bi-plus-lg"></i>}
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="karta-sekcja">
        <Card.Header className="naglowek-sekcji d-flex justify-content-between align-items-center">
          <span><i className="bi bi-card-list me-2"></i>Fiszki</span>
          <Badge bg="secondary" pill>{fiszki.length}</Badge>
        </Card.Header>
        <ListGroup variant="flush">
          {fiszki.length === 0 ? (
            <ListGroup.Item className="element-listy text-center text-muted py-4">
              <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '2rem' }}></i>
              Brak fiszek. Dodaj pierwszą powyżej.
            </ListGroup.Item>
          ) : (
            fiszki.map((fiszka, indeks) => (
              <ListGroup.Item key={fiszka.id} className="element-listy">
                {edytowanaFiszkaId === fiszka.id ? (
                  <div className="d-flex gap-2 align-items-center">
                    <span className="numer-fiszki">{indeks + 1}.</span>
                    <Form.Control type="text" size="sm" value={edytowanyPrzod} onChange={(e) => ustawEdytowanyPrzod(e.target.value)} className="pole-formularza" />
                    <Form.Control type="text" size="sm" value={edytowanyTyl} onChange={(e) => ustawEdytowanyTyl(e.target.value)} className="pole-formularza" />
                    <Button variant="success" size="sm" onClick={obsluzZapiszFiszke}><i className="bi bi-check-lg"></i></Button>
                    <Button variant="secondary" size="sm" onClick={() => ustawEdytowanaFiszkaId(null)}><i className="bi bi-x-lg"></i></Button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3 flex-grow-1">
                      <span className="numer-fiszki">{indeks + 1}.</span>
                      <div className="tresc-fiszki-lista">
                        <strong>{fiszka.przod}</strong>
                        <span className="separator-fiszki mx-2">→</span>
                        <span className="text-muted">{fiszka.tyl}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm" onClick={() => rozpocznijEdycje(fiszka)}><i className="bi bi-pencil"></i></Button>
                      <Button variant="outline-danger" size="sm" onClick={() => obsluzUsunFiszke(fiszka.id)}><i className="bi bi-trash"></i></Button>
                    </div>
                  </div>
                )}
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card>
    </Container>
  );
}

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Tab, Tabs, Spinner } from 'react-bootstrap';
import { useAutoryzacja } from '../contexts/KontekstAutoryzacji';

export default function StronaLogowania() {
  const { uzytkownik, logowanie, rejestracja } = useAutoryzacja();
  const nawiguj = useNavigate();

  const [aktywnaZakladka, ustawAktywnaZakladke] = useState('logowanie');
  const [email, ustawEmail] = useState('');
  const [haslo, ustawHaslo] = useState('');
  const [potwierdzHaslo, ustawPotwierdzHaslo] = useState('');
  const [blad, ustawBlad] = useState('');
  const [ladowanie, ustawLadowanie] = useState(false);

  
  if (uzytkownik && !ladowanie) {
    return <Navigate to="/" />;
  }

  function przetlumaczBlad(kodBledu) {
    const tlumaczenia = {
      'auth/email-already-in-use': 'Ten adres e-mail jest już zarejestrowany.',
      'auth/invalid-email': 'Nieprawidłowy adres e-mail.',
      'auth/weak-password': 'Hasło musi mieć co najmniej 6 znaków.',
      'auth/user-not-found': 'Nie znaleziono użytkownika z tym adresem e-mail.',
      'auth/wrong-password': 'Nieprawidłowe hasło.',
      'auth/invalid-credential': 'Nieprawidłowe dane logowania.',
      'auth/too-many-requests': 'Zbyt wiele prób. Spróbuj ponownie później.',
    };
    return tlumaczenia[kodBledu] || `Wystąpił błąd: ${kodBledu}`;
  }

  async function obsluzLogowanie(e) {
    e.preventDefault();
    ustawBlad('');
    if (!email || !haslo) {
      ustawBlad('Wypełnij wszystkie pola.');
      return;
    }
    ustawLadowanie(true);
    try {
      await logowanie(email, haslo);
      nawiguj('/');
    } catch (err) {
      ustawBlad(przetlumaczBlad(err.code));
    }
    ustawLadowanie(false);
  }

  async function obsluzRejestracje(e) {
    e.preventDefault();
    ustawBlad('');
    if (!email || !haslo || !potwierdzHaslo) {
      ustawBlad('Wypełnij wszystkie pola.');
      return;
    }
    if (haslo !== potwierdzHaslo) {
      ustawBlad('Hasła nie są identyczne.');
      return;
    }
    if (haslo.length < 6) {
      ustawBlad('Hasło musi mieć co najmniej 6 znaków.');
      return;
    }
    ustawLadowanie(true);
    try {
      await rejestracja(email, haslo);
      nawiguj('/');
    } catch (err) {
      ustawBlad(przetlumaczBlad(err.code));
    }
    ustawLadowanie(false);
  }

  return (
    <div className="tlo-logowania">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="karta-logowania-wrapper">
          <div className="text-center mb-4">
            <div className="logo-logowania">
              <i className="bi bi-stack"></i>
            </div>
            <h1 className="tytul-logowania">Fiszki</h1>
            <p className="podtytul-logowania">Ucz się efektywnie z fiszkami</p>
          </div>

          <Card className="karta-logowania">
            <Card.Body className="p-4">
              {blad && (
                <Alert variant="danger" dismissible onClose={() => ustawBlad('')}>
                  <i className="bi bi-exclamation-triangle me-2"></i>{blad}
                </Alert>
              )}

              <Tabs
                activeKey={aktywnaZakladka}
                onSelect={(k) => { ustawAktywnaZakladke(k); ustawBlad(''); }}
                className="mb-4 zakladki-logowania"
                fill
              >
                <Tab eventKey="logowanie" title={<><i className="bi bi-box-arrow-in-right me-1"></i>Logowanie</>}>
                  <Form onSubmit={obsluzLogowanie}>
                    <Form.Group className="mb-3" controlId="loginEmail">
                      <Form.Label>Adres e-mail</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="twoj@email.pl"
                        value={email}
                        onChange={(e) => ustawEmail(e.target.value)}
                        className="pole-formularza"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="loginHaslo">
                      <Form.Label>Hasło</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Wpisz hasło"
                        value={haslo}
                        onChange={(e) => ustawHaslo(e.target.value)}
                        className="pole-formularza"
                      />
                    </Form.Group>
                    <Button type="submit" className="w-100 przycisk-glowny" disabled={ladowanie}>
                      {ladowanie ? <Spinner size="sm" animation="border" className="me-2" /> : <i className="bi bi-box-arrow-in-right me-2"></i>}
                      Zaloguj się
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="rejestracja" title={<><i className="bi bi-person-plus me-1"></i>Rejestracja</>}>
                  <Form onSubmit={obsluzRejestracje}>
                    <Form.Group className="mb-3" controlId="rejestracjaEmail">
                      <Form.Label>Adres e-mail</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="twoj@email.pl"
                        value={email}
                        onChange={(e) => ustawEmail(e.target.value)}
                        className="pole-formularza"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="rejestracjaHaslo">
                      <Form.Label>Hasło</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Minimum 6 znaków"
                        value={haslo}
                        onChange={(e) => ustawHaslo(e.target.value)}
                        className="pole-formularza"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="rejestracjaPotwierdzHaslo">
                      <Form.Label>Potwierdź hasło</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Powtórz hasło"
                        value={potwierdzHaslo}
                        onChange={(e) => ustawPotwierdzHaslo(e.target.value)}
                        className="pole-formularza"
                      />
                    </Form.Group>
                    <Button type="submit" className="w-100 przycisk-glowny" disabled={ladowanie}>
                      {ladowanie ? <Spinner size="sm" animation="border" className="me-2" /> : <i className="bi bi-person-plus me-2"></i>}
                      Zarejestruj się
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}

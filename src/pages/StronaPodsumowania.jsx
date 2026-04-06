import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

export default function StronaPodsumowania() {
  const nawiguj = useNavigate();
  const lokalizacja = useLocation();
  const dane = lokalizacja.state;

  if (!dane) return <Navigate to="/" />;

  const { nazwaTalii, calkowitaLiczba, poprawneOdpowiedzi, bledneOdpowiedzi } = dane;
  const procentPoprawnych = Math.round((calkowitaLiczba / (calkowitaLiczba + bledneOdpowiedzi)) * 100);

  let ikona, wiadomosc, kolorIkony;
  if (bledneOdpowiedzi === 0) {
    ikona = 'bi-trophy-fill';
    wiadomosc = 'Perfekcyjnie! Znasz wszystkie karty za pierwszym razem!';
    kolorIkony = '#ffd700';
  } else if (procentPoprawnych >= 70) {
    ikona = 'bi-emoji-smile-fill';
    wiadomosc = 'Świetna robota! Większość kart znałeś od razu!';
    kolorIkony = '#28a745';
  } else if (procentPoprawnych >= 40) {
    ikona = 'bi-emoji-neutral-fill';
    wiadomosc = 'Nieźle! Ale jest jeszcze nad czym pracować.';
    kolorIkony = '#ffc107';
  } else {
    ikona = 'bi-emoji-frown-fill';
    wiadomosc = 'Nie poddawaj się! Powtarzaj regularnie, a zobaczysz postępy!';
    kolorIkony = '#dc3545';
  }

  return (
    <Container className="py-5 strona-podsumowania">
      <div className="text-center mb-5">
        <div className="ikona-podsumowania" style={{ color: kolorIkony }}><i className={`bi ${ikona}`}></i></div>
        <h2 className="tytul-podsumowania mt-3">Sesja zakończona!</h2>
        <p className="podtytul-podsumowania text-muted">{nazwaTalii}</p>
        <p className="wiadomosc-podsumowania">{wiadomosc}</p>
      </div>

      <Row className="justify-content-center g-4 mb-5">
        <Col xs={6} md={3}>
          <Card className="karta-statystyka text-center">
            <Card.Body>
              <div className="wartosc-statystyki text-primary">{calkowitaLiczba}</div>
              <div className="etykieta-statystyki">Wszystkich kart</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="karta-statystyka text-center">
            <Card.Body>
              <div className="wartosc-statystyki text-success">{poprawneOdpowiedzi}</div>
              <div className="etykieta-statystyki"><i className="bi bi-check-circle me-1"></i>Znam</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="karta-statystyka text-center">
            <Card.Body>
              <div className="wartosc-statystyki text-danger">{bledneOdpowiedzi}</div>
              <div className="etykieta-statystyki"><i className="bi bi-x-circle me-1"></i>Powtórek</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="karta-statystyka text-center">
            <Card.Body>
              <div className="wartosc-statystyki" style={{ color: kolorIkony }}>{procentPoprawnych}%</div>
              <div className="etykieta-statystyki">Efektywność</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center">
        <Button className="przycisk-glowny" size="lg" onClick={() => nawiguj('/')}>
          <i className="bi bi-house-door me-2"></i>Wróć do pulpitu
        </Button>
      </div>
    </Container>
  );
}

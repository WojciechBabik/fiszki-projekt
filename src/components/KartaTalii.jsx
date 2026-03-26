import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function KartaTalii({ talia, liczbaFiszek, naUsun }) {
  const nawiguj = useNavigate();

  return (
    <Card className="karta-talii h-100">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="tytul-talii mb-0">{talia.nazwa}</Card.Title>
          <Badge bg="secondary" pill className="odznaka-liczba">
            {liczbaFiszek} {liczbaFiszek === 1 ? 'fiszka' : liczbaFiszek < 5 ? 'fiszki' : 'fiszek'}
          </Badge>
        </div>
        {talia.opis && (
          <Card.Text className="opis-talii text-muted flex-grow-1">{talia.opis}</Card.Text>
        )}
        {!talia.opis && <div className="flex-grow-1" />}
        <div className="przyciski-talii d-flex gap-2 mt-3">
          <Button
            variant="success"
            size="sm"
            className="flex-fill"
            disabled={liczbaFiszek === 0}
            onClick={() => nawiguj(`/nauka/${talia.id}`)}
            title={liczbaFiszek === 0 ? 'Dodaj fiszki aby rozpocząć naukę' : 'Rozpocznij naukę'}
          >
            <i className="bi bi-play-fill me-1"></i>Ucz się
          </Button>
          <Button variant="outline-primary" size="sm" className="flex-fill" onClick={() => nawiguj(`/talia/${talia.id}`)}>
            <i className="bi bi-pencil me-1"></i>Edytuj
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => naUsun(talia.id, talia.nazwa)}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

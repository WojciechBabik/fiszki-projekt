import { useState, useEffect, useRef } from 'react';
import { Container, Button, ProgressBar, Spinner, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAutoryzacja } from '../contexts/KontekstAutoryzacji';
import { pobierzTalie1, pobierzFiszki, dodajAktywnosc } from '../services/serwisFirestore';
import FiszkaObracana from '../components/FiszkaObracana';

export default function StronaNauki() {
  const { id } = useParams();
  const { uzytkownik } = useAutoryzacja();
  const nawiguj = useNavigate();

  const [talia, ustawTalie] = useState(null);
  const [kolejka, ustawKolejke] = useState([]);
  const [ladowanie, ustawLadowanie] = useState(true);
  const [blad, ustawBlad] = useState('');
  const [czyOdwrocona, ustawCzyOdwrocona] = useState(false);
  const [calkowitaLiczba, ustawCalkowitaLiczbe] = useState(0);
  const [poprawneOdpowiedzi, ustawPoprawneOdpowiedzi] = useState(0);
  const [bledneOdpowiedzi, ustawBledneOdpowiedzi] = useState(0);
  const [animacjaWyjscia, ustawAnimacjaWyjscia] = useState('');
  const pytaOWznowienie = useRef(false);

  useEffect(() => { zaladujSesjie(); }, [id, uzytkownik]);

  async function zaladujSesjie() {
    ustawLadowanie(true);
    try {
      const daneTalii = await pobierzTalie1(uzytkownik.uid, id);
      if (!daneTalii) { ustawBlad('Nie znaleziono talii.'); ustawLadowanie(false); return; }
      ustawTalie(daneTalii);
      const daneFiszek = await pobierzFiszki(uzytkownik.uid, id);
      if (daneFiszek.length === 0) {
        ustawBlad('Ta talia nie ma żadnych fiszek. Dodaj fiszki aby rozpocząć naukę.');
        ustawLadowanie(false);
        return;
      }
      
      const zapisanaSesja = localStorage.getItem(`sesja_nauki_${id}`);
      if (zapisanaSesja && !pytaOWznowienie.current) {
        pytaOWznowienie.current = true;
        if (window.confirm('Masz niedokończoną sesję w tej talii. Chcesz kontynuować tam, gdzie skończyłeś?')) {
          const parsing = JSON.parse(zapisanaSesja);
          ustawKolejke(parsing.kolejka);
          ustawCalkowitaLiczbe(parsing.calkowitaLiczba);
          ustawPoprawneOdpowiedzi(parsing.poprawneOdpowiedzi);
          ustawBledneOdpowiedzi(parsing.bledneOdpowiedzi);
          ustawLadowanie(false);
          return;
        } else {
          localStorage.removeItem(`sesja_nauki_${id}`);
        }
      }

      const przetasowane = [...daneFiszek].sort(() => Math.random() - 0.5);
      ustawKolejke(przetasowane);
      ustawCalkowitaLiczbe(daneFiszek.length);
    } catch (err) {
      console.error(err);
      ustawBlad('Nie udało się załadować sesji nauki.');
    }
    ustawLadowanie(false);
  }

  useEffect(() => {
    if (kolejka.length > 0 && calkowitaLiczba > 0) {
      const stanSesji = { kolejka, calkowitaLiczba, poprawneOdpowiedzi, bledneOdpowiedzi };
      localStorage.setItem(`sesja_nauki_${id}`, JSON.stringify(stanSesji));
    }
  }, [kolejka, calkowitaLiczba, poprawneOdpowiedzi, bledneOdpowiedzi, id]);

  function odwrocKarte() {
    ustawCzyOdwrocona(!czyOdwrocona);
  }

  function obsluzZnam() {
    ustawAnimacjaWyjscia('wyjscie-prawo');
    ustawPoprawneOdpowiedzi((prev) => prev + 1);

    
    dodajAktywnosc(uzytkownik.uid, 1).catch(err => console.error(err));

    setTimeout(() => {
      const nowaKolejka = kolejka.slice(1);
      ustawKolejke(nowaKolejka);
      ustawCzyOdwrocona(false);
      ustawAnimacjaWyjscia('');
      if (nowaKolejka.length === 0) {
        localStorage.removeItem(`sesja_nauki_${id}`);
        nawiguj('/podsumowanie', {
          state: {
            nazwaTalii: talia.nazwa,
            calkowitaLiczba,
            poprawneOdpowiedzi: poprawneOdpowiedzi + 1,
            bledneOdpowiedzi,
          },
        });
      }
    }, 300);
  }

  function obsluzNieZnam() {
    ustawAnimacjaWyjscia('wyjscie-lewo');
    ustawBledneOdpowiedzi((prev) => prev + 1);
    setTimeout(() => {
      const obecnaKarta = kolejka[0];
      const nowaKolejka = [...kolejka.slice(1), obecnaKarta];
      ustawKolejke(nowaKolejka);
      ustawCzyOdwrocona(false);
      ustawAnimacjaWyjscia('');
    }, 300);
  }

  const postep = calkowitaLiczba > 0 ? Math.round((poprawneOdpowiedzi / calkowitaLiczba) * 100) : 0;

  if (ladowanie) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="light" />
          <p className="mt-3 text-muted">Przygotowywanie sesji nauki...</p>
        </div>
      </Container>
    );
  }

  if (blad) {
    return (
      <Container className="py-4 text-center">
        <Alert variant="warning"><i className="bi bi-exclamation-triangle me-2"></i>{blad}</Alert>
        <Button className="przycisk-glowny" onClick={() => nawiguj('/')}>
          <i className="bi bi-arrow-left me-1"></i>Wróć do pulpitu
        </Button>
      </Container>
    );
  }

  const obecnaKarta = kolejka[0];

  if (!obecnaKarta) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="light" />
          <p className="mt-3 text-muted">Zapisywanie postępów...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4 strona-nauki">
      <div className="text-center mb-4">
        <h3 className="tytul-sesji"><i className="bi bi-book me-2"></i>{talia?.nazwa}</h3>
        <div className="d-flex justify-content-center gap-3 mb-3">
          <Badge bg="info" className="odznaka-statystyka"><i className="bi bi-layers me-1"></i>Pozostało: {kolejka.length}</Badge>
          <Badge bg="success" className="odznaka-statystyka"><i className="bi bi-check-circle me-1"></i>Znam: {poprawneOdpowiedzi}</Badge>
          <Badge bg="danger" className="odznaka-statystyka"><i className="bi bi-x-circle me-1"></i>Nie znam: {bledneOdpowiedzi}</Badge>
        </div>
        <ProgressBar now={postep} label={`${postep}%`} variant="success" className="pasek-postepu mb-4" animated />
      </div>

      <div className={`wrapper-animacji ${animacjaWyjscia}`}>
        <FiszkaObracana przod={obecnaKarta.przod} tyl={obecnaKarta.tyl} czyOdwrocona={czyOdwrocona} naKliknieceOdwroc={odwrocKarte} />
      </div>

      <div className="przyciski-nauki d-flex justify-content-center gap-3 mt-4">
        {!czyOdwrocona ? (
          <Button size="lg" className="przycisk-odwroc" onClick={odwrocKarte}>
            <i className="bi bi-arrow-repeat me-2"></i>Odwróć kartę
          </Button>
        ) : (
          <>
            <Button variant="danger" size="lg" className="przycisk-nie-znam" onClick={obsluzNieZnam}>
              <i className="bi bi-x-lg me-2"></i>Nie znam
            </Button>
            <Button variant="success" size="lg" className="przycisk-znam" onClick={obsluzZnam}>
              <i className="bi bi-check-lg me-2"></i>Znam
            </Button>
          </>
        )}
      </div>

      <div className="text-center mt-4">
        <Button variant="link" className="przycisk-powrot" onClick={() => { if (window.confirm('Czy na pewno chcesz zakończyć sesję nauki?')) nawiguj('/'); }}>
          <i className="bi bi-arrow-left me-1"></i>Zakończ sesję
        </Button>
      </div>
    </Container>
  );
}

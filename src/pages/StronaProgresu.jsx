import { useState, useEffect } from 'react';
import { Container, Spinner, OverlayTrigger, Tooltip, Alert, Button } from 'react-bootstrap';
import { useAutoryzacja } from '../contexts/KontekstAutoryzacji';
import { pobierzAktywnosc } from '../services/serwisFirestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function StronaProgresu() {
  const { uzytkownik } = useAutoryzacja();
  const nawiguj = useNavigate();
  const [aktywnosc, ustawAktywnosc] = useState({});
  const [streak, ustawStreak] = useState(0);
  const [ladowanie, ustawLadowanie] = useState(true);
  const [blad, ustawBlad] = useState('');

  useEffect(() => {
    async function zaladujProgres() {
      ustawLadowanie(true);
      try {
        const hist = await pobierzAktywnosc(uzytkownik.uid);
        ustawAktywnosc(hist);
        
        let dniZRzedu = 0;
        let dataSprawdzenia = new Date();
        const dzisiaj = dataSprawdzenia.toISOString().split('T')[0];
        let wczorajDate = new Date();
        wczorajDate.setDate(wczorajDate.getDate() - 1);
        const wczoraj = wczorajDate.toISOString().split('T')[0];

        if (hist[dzisiaj] || hist[wczoraj]) {
          let licznikDaty = hist[dzisiaj] ? new Date() : wczorajDate;
          while(true) {
            const str = licznikDaty.toISOString().split('T')[0];
            if (hist[str] && hist[str] > 0) {
              dniZRzedu++;
              licznikDaty.setDate(licznikDaty.getDate() - 1);
            } else {
              break;
            }
          }
        }
        ustawStreak(dniZRzedu);
      } catch (err) {
        console.error(err);
        ustawBlad('Nie udało się pobrać statystyk.');
      }
      ustawLadowanie(false);
    }
    zaladujProgres();
  }, [uzytkownik]);

  if (ladowanie) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="light" />
      </Container>
    );
  }

  
  const dniHeatmapy = [];
  const start = new Date();
  start.setDate(start.getDate() - 13);
  for (let i = 0; i < 14; i++) {
    const dataKafelka = new Date(start);
    dataKafelka.setDate(dataKafelka.getDate() + i);
    const kluczStr = dataKafelka.toISOString().split('T')[0];
    const wartosc = aktywnosc[kluczStr] || 0;
    let klasaPoziomu = 'poziom-0';
    if (wartosc > 0) klasaPoziomu = 'poziom-1';
    if (wartosc >= 10) klasaPoziomu = 'poziom-2';
    if (wartosc >= 30) klasaPoziomu = 'poziom-3';
    dniHeatmapy.push({ data: kluczStr, klasaPoziomu, wartosc });
  }

  
  const dniWykresu = [];
  const startWykres = new Date();
  startWykres.setDate(startWykres.getDate() - 6);
  const dniTygodniaLokalne = ['Niedz.', 'Pon.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'Sob.'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startWykres);
    d.setDate(d.getDate() + i);
    const klucz = d.toISOString().split('T')[0];
    dniWykresu.push({ name: dniTygodniaLokalne[d.getDay()], pelnaData: klucz, Fiszki: aktywnosc[klucz] || 0 });
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="tytul-strony">
          <i className="bi bi-graph-up-arrow me-2"></i>Statystyki nauki
        </h2>
        <div className="streak-box text-center">
            <div className="streak-fire" style={{ opacity: streak > 0 ? 1 : 0.5 }}>🔥</div>
            <div className="streak-number">{streak} dni</div>
        </div>
      </div>

      {blad && <Alert variant="danger">{blad}</Alert>}

      <div className="heatmap-container mb-4">
        <h6 className="text-muted mb-3"><i className="bi bi-activity me-2"></i>Twoja aktywność (ostatnie 14 dni)</h6>
        <div className="d-flex align-items-center gap-1 mb-2">
          {dniHeatmapy.map((dzien, idx) => (
            <OverlayTrigger
              key={idx}
              placement="top"
              overlay={<Tooltip id={`tooltip-heatmap-${idx}`}>{dzien.data}: <strong>{dzien.wartosc}</strong> fiszek</Tooltip>}
            >
              <div className={`heatmap-kafelek ${dzien.klasaPoziomu}`}></div>
            </OverlayTrigger>
          ))}
        </div>
        <small className="text-muted" style={{ fontSize: '11px' }}>Im głębsza zieleń tym więcej przyswojonych fiszek danego dnia.</small>
      </div>

      <div className="heatmap-container mb-4">
        <h6 className="text-muted mb-3"><i className="bi bi-bar-chart-fill me-2"></i>Postęp z ostatnich 7 dni</h6>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={dniWykresu} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--kolor-tekst-przyciszony)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="var(--kolor-tekst-przyciszony)" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                contentStyle={{ backgroundColor: 'var(--kolor-tlo-powierzchnia)', borderColor: 'var(--kolor-obramowanie)', color: 'var(--kolor-tekst)', borderRadius: '8px' }}
                labelStyle={{ color: 'var(--kolor-tekst-przyciszony)', marginBottom: '4px' }}
              />
              <Bar dataKey="Fiszki" fill="#28a745" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-center mt-5">
         <Button className="przycisk-powrot text-muted" variant="link" onClick={() => nawiguj('/')}>Wróć na Pulpit</Button>
      </div>
    </Container>
  );
}

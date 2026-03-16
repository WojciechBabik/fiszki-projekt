import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DostawcaAutoryzacji } from './contexts/KontekstAutoryzacji';
import TrasaPrywatna from './components/TrasaPrywatna';
import PasekNawigacji from './components/PasekNawigacji';
import StronaLogowania from './pages/StronaLogowania';
import StronaPulpitu from './pages/StronaPulpitu';
import StronaEdycjiTalii from './pages/StronaEdycjiTalii';
import StronaNauki from './pages/StronaNauki';
import StronaPodsumowania from './pages/StronaPodsumowania';
import StronaProgresu from './pages/StronaProgresu';
import './App.css';

function UkladAplikacji({ children }) {
  return (
    <>
      <PasekNawigacji />
      <main>{children}</main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DostawcaAutoryzacji>
        <Routes>
          <Route path="/logowanie" element={<StronaLogowania />} />
          <Route path="/" element={<TrasaPrywatna><UkladAplikacji><StronaPulpitu /></UkladAplikacji></TrasaPrywatna>} />
          <Route path="/talia/:id" element={<TrasaPrywatna><UkladAplikacji><StronaEdycjiTalii /></UkladAplikacji></TrasaPrywatna>} />
          <Route path="/nauka/:id" element={<TrasaPrywatna><UkladAplikacji><StronaNauki /></UkladAplikacji></TrasaPrywatna>} />
          <Route path="/podsumowanie" element={<TrasaPrywatna><UkladAplikacji><StronaPodsumowania /></UkladAplikacji></TrasaPrywatna>} />
          <Route path="/progres" element={<TrasaPrywatna><UkladAplikacji><StronaProgresu /></UkladAplikacji></TrasaPrywatna>} />
        </Routes>
      </DostawcaAutoryzacji>
    </BrowserRouter>
  );
}

export default App;

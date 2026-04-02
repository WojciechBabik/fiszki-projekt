export default function FiszkaObracana({ przod, tyl, czyOdwrocona, naKliknieceOdwroc }) {
  return (
    <div className="kontener-fiszki" onClick={naKliknieceOdwroc}>
      <div className={`wnetrze-fiszki ${czyOdwrocona ? 'odwrocona' : ''}`}>
        <div className="strona-fiszki przod-fiszki">
          <div className="etykieta-strony">POJĘCIE</div>
          <div className="tresc-fiszki">{przod}</div>
          <div className="podpowiedz-klikniecia">
            <i className="bi bi-arrow-repeat me-1"></i>
            Kliknij aby odwrócić
          </div>
        </div>
        <div className="strona-fiszki tyl-fiszki">
          <div className="etykieta-strony">DEFINICJA</div>
          <div className="tresc-fiszki">{tyl}</div>
          <div className="podpowiedz-klikniecia">
            <i className="bi bi-arrow-repeat me-1"></i>
            Kliknij aby odwrócić
          </div>
        </div>
      </div>
    </div>
  );
}

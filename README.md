# 🧠 Fiszki - Interaktywna Aplikacja do Nauki

Witaj w projekcie **Fiszki** – super wydajnej, zbudowanej w React aplikacji Single-Page, inspirowanej zaawansowanymi systemami Spaced Repetition (SRS) oraz najpopularniejszymi aplikacjami z zakresu gamifikacji nauki (jak Duolingo czy Quizlet).

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

## ✨ Główne Funkcjonalności

- 🃏 **Karty Fiszki 3D:** Pełny silnik renderujący animacje rotacji kart o 180-stopni oparty w 100% na matematyce CSS, dający poczucie manipulacji prawdziwą kartą z przodu i z tyłu.
- 🔐 **Autoryzacja Firebase:** Zaprojektowany wieloosobowy system ochrony tras i prywatności kont dzięki potężnym zabezpieczeniom chmury Google (obsługa Email & Hasło, ciasteczka sesyjne).
- 📊 **Analityka i Recharts:** Zaawansowany i odizolowany moduł metadanych użytkowników (Heatmapa a'la GitHub rzeźbiąca postęp przez ostatnie 14 dni z własnoręcznie utkanym skryptem dat, wzmocniona wykresem `BarChart` z 7 ostatnich dni).
- 🔥 **Algorytm Streaka:** Licznik dniowej ciągłości i wysiłków operujący na iteracji obiektów tablicowych, pobudzający retencję systemu grywalizacji.
- 💾 **Safe-Resume (LocalStorage):** Inżynieria przechwytywania awaryjnie zamykanych okien przeglądarki. Aplikacja pamięta ułamkowy wynik przerwanej partii do pamięci sprzętowej urządzenia redukując potrzebę obciążających, natychmiastowych zrzutów backendowych.

## 🛠️ Użyta Technologia
**Frontend:** React 19, JavaScript (ES6+), CSS3  
**Framework:** Vite (Ultraszybki serwer HMR)  
**Routing:** React Router DOM (v7)  
**Stylizacja:** React-Bootstrap 5, Bootstrap Icons  
**Wizualizacja Statystyk:** Recharts  
**Backend:** Firebase (Cloud Firestore NoSQL, Firebase Authentication)

## 🚀 Jak odpalić projekt u siebie?

Upewnij się, że masz zainstalowane na swoim komputerze oprogramowanie **Node.js**. Poniższe komendy pobiorą projekt i otworzą go jako w pełni funkcjonalny dedykowany serwer (z odblokowanym hostowaniem LAN dla urządzeń w tej samej sieci Wi-Fi).

1. Sklonuj repozytorium do siebie na dysk i wejdź do folderu:
```bash
git clone https://github.com/WojciechBabik/fiszki-projekt.git
cd fiszki-projekt
```

2. Zainstaluj gigabajty paczek środowiska z repozytoriów npm:
```bash
npm install
```

3. Odpal silnik serwera:
```bash
npm run dev
```

Aplikacja będzie natychmiastowo otwarta i zdatna do testów na adresie `http://localhost:5173/`. 
*Miłej nauki i potężnych, płonących Streak-ów osiągniętych bez omyłki na jednej karcie!* 🔥

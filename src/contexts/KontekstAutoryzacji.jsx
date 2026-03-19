import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { autoryzacja } from '../firebase';
import { utworzPrzykladoweDane } from '../services/serwisFirestore';

const KontekstAutoryzacji = createContext();

export function useAutoryzacja() {
  return useContext(KontekstAutoryzacji);
}

export function DostawcaAutoryzacji({ children }) {
  const [uzytkownik, ustawUzytkownika] = useState(null);
  const [ladowanie, ustawLadowanie] = useState(true);

  async function rejestracja(email, haslo) {
    const wynik = await createUserWithEmailAndPassword(autoryzacja, email, haslo);
    
    await utworzPrzykladoweDane(wynik.user.uid);
    return wynik;
  }

  function logowanie(email, haslo) {
    return signInWithEmailAndPassword(autoryzacja, email, haslo);
  }

  function wylogowanie() {
    return signOut(autoryzacja);
  }

  useEffect(() => {
    const anulujNasluch = onAuthStateChanged(autoryzacja, (uzytkownikFirebase) => {
      ustawUzytkownika(uzytkownikFirebase);
      ustawLadowanie(false);
    });
    return anulujNasluch;
  }, []);

  const wartosc = {
    uzytkownik,
    ladowanie,
    rejestracja,
    logowanie,
    wylogowanie,
  };

  return (
    <KontekstAutoryzacji.Provider value={wartosc}>
      {children}
    </KontekstAutoryzacji.Provider>
  );
}

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  increment
} from 'firebase/firestore';
import { bazaDanych } from '../firebase';

function kolekcjaTalii(idUzytkownika) {
  return collection(bazaDanych, 'uzytkownicy', idUzytkownika, 'talie');
}

function dokumentTalii(idUzytkownika, idTalii) {
  return doc(bazaDanych, 'uzytkownicy', idUzytkownika, 'talie', idTalii);
}

export async function pobierzTalie(idUzytkownika) {
  const zapytanie = query(
    kolekcjaTalii(idUzytkownika),
    orderBy('utworzonoData', 'desc')
  );
  const wynik = await getDocs(zapytanie);
  return wynik.docs.map((dok) => ({
    id: dok.id,
    ...dok.data(),
  }));
}

export async function pobierzTalie1(idUzytkownika, idTalii) {
  const dok = await getDoc(dokumentTalii(idUzytkownika, idTalii));
  if (dok.exists()) {
    return { id: dok.id, ...dok.data() };
  }
  return null;
}

export async function dodajTalie(idUzytkownika, daneTalii) {
  return addDoc(kolekcjaTalii(idUzytkownika), {
    nazwa: daneTalii.nazwa,
    opis: daneTalii.opis || '',
    utworzonoData: serverTimestamp(),
    zaktualizowanoData: serverTimestamp(),
  });
}

export async function aktualizujTalie(idUzytkownika, idTalii, daneTalii) {
  return updateDoc(dokumentTalii(idUzytkownika, idTalii), {
    ...daneTalii,
    zaktualizowanoData: serverTimestamp(),
  });
}

export async function usunTalie(idUzytkownika, idTalii) {
  const fiszki = await pobierzFiszki(idUzytkownika, idTalii);
  for (const fiszka of fiszki) {
    await deleteDoc(dokumentFiszki(idUzytkownika, idTalii, fiszka.id));
  }
  return deleteDoc(dokumentTalii(idUzytkownika, idTalii));
}

function kolekcjaFiszek(idUzytkownika, idTalii) {
  return collection(
    bazaDanych, 'uzytkownicy', idUzytkownika, 'talie', idTalii, 'fiszki'
  );
}

function dokumentFiszki(idUzytkownika, idTalii, idFiszki) {
  return doc(
    bazaDanych, 'uzytkownicy', idUzytkownika, 'talie', idTalii, 'fiszki', idFiszki
  );
}

export async function pobierzFiszki(idUzytkownika, idTalii) {
  const zapytanie = query(
    kolekcjaFiszek(idUzytkownika, idTalii),
    orderBy('utworzonoData', 'asc')
  );
  const wynik = await getDocs(zapytanie);
  return wynik.docs.map((dok) => ({
    id: dok.id,
    ...dok.data(),
  }));
}

export async function dodajFiszke(idUzytkownika, idTalii, daneFiszki) {
  return addDoc(kolekcjaFiszek(idUzytkownika, idTalii), {
    przod: daneFiszki.przod,
    tyl: daneFiszki.tyl,
    utworzonoData: serverTimestamp(),
  });
}

export async function aktualizujFiszke(idUzytkownika, idTalii, idFiszki, daneFiszki) {
  return updateDoc(dokumentFiszki(idUzytkownika, idTalii, idFiszki), {
    przod: daneFiszki.przod,
    tyl: daneFiszki.tyl,
  });
}

export async function usunFiszke(idUzytkownika, idTalii, idFiszki) {
  return deleteDoc(dokumentFiszki(idUzytkownika, idTalii, idFiszki));
}

export async function policzFiszki(idUzytkownika, idTalii) {
  const wynik = await getDocs(kolekcjaFiszek(idUzytkownika, idTalii));
  return wynik.size;
}

export async function utworzPrzykladoweDane(idUzytkownika) {
  try {
    const refTalii1 = await dodajTalie(idUzytkownika, {
      nazwa: 'Angielski - Podstawy',
      opis: 'Zacznij naukę od tych prostych słówek! Możesz edytować lub usunąć tę talię.'
    });
    
    
    await Promise.all([
      dodajFiszke(idUzytkownika, refTalii1.id, { przod: 'Apple', tyl: 'Jabłko' }),
      dodajFiszke(idUzytkownika, refTalii1.id, { przod: 'Dog', tyl: 'Pies' }),
      dodajFiszke(idUzytkownika, refTalii1.id, { przod: 'Cat', tyl: 'Kot' }),
      dodajFiszke(idUzytkownika, refTalii1.id, { przod: 'House', tyl: 'Dom' }),
      dodajFiszke(idUzytkownika, refTalii1.id, { przod: 'Water', tyl: 'Woda' })
    ]);
  } catch (err) {
    console.error('Błąd podczas tworzenia przykładowych danych:', err);
  }
}

export async function dodajAktywnosc(idUzytkownika, liczbaSiatka) {
  try {
    const dzisiaj = new Date().toISOString().split('T')[0];
    const docRef = doc(bazaDanych, 'uzytkownicy', idUzytkownika, 'aktywnosc', dzisiaj);
    
    
    await setDoc(docRef, { 
      przeanalizowano: increment(liczbaSiatka) 
    }, { merge: true });
  } catch (err) {
    console.error('Błąd podczas zapisywania aktywności:', err);
  }
}

export async function pobierzAktywnosc(idUzytkownika) {
  try {
    
    const zapytanie = collection(bazaDanych, 'uzytkownicy', idUzytkownika, 'aktywnosc');
    const wynik = await getDocs(zapytanie);
    const historia = {};
    wynik.docs.forEach((dok) => {
      historia[dok.id] = dok.data().przeanalizowano;
    });
    return historia; 
  } catch(err) {
    console.error('Błąd przy pobieraniu historii:', err);
    return {};
  }
}

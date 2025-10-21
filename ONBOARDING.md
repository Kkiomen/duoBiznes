# Onboarding - Ekrany powitalne aplikacji

## Przegląd

Onboarding to seria 4 animowanych ekranów wprowadzających, które pokazują się **tylko raz** przy pierwszym uruchomieniu aplikacji przez niezalogowanego użytkownika.

## Funkcjonalność

### ✨ Główne cechy

- **Jednorazowe wyświetlenie** - pojawia się tylko przy pierwszym uruchomieniu
- **4 slajdy** z różnymi gradientami i emoji
- **Animacje** - płynne przejścia między slajdami
- **Wielojęzyczność** - pełne wsparcie dla polskiego i angielskiego
- **Możliwość pominięcia** - przycisk "Pomiń" na każdym slajdzie (oprócz ostatniego)
- **Nawigacja** - przyciski "Wstecz" i "Dalej"

### 📱 Slajdy onboardingu

1. **Slajd 1: Powitanie** 🚀
   - Gradient: fioletowy (#667eea → #764ba2)
   - Przedstawia Aisello jako platformę AI

2. **Slajd 2: Automatyzacja** 🤖
   - Gradient: różowy (#f093fb → #f5576c)
   - Opisuje automatyczne generowanie treści (opisy produktów, posty LinkedIn)

3. **Slajd 3: Narzędzia** 📝
   - Gradient: niebieski (#4facfe → #00f2fe)
   - Prezentuje gotowe rozwiązania AI (ContentAI, SalesAI)

4. **Slajd 4: Kursy** 📚
   - Gradient: zielony (#43e97b → #38f9d7)
   - Przedstawia kursy i szkolenia AI
   - Przycisk "Rozpocznij" zamiast "Dalej"
   - Link "Masz już konto? Zaloguj się"

## Logika działania

### Wykrywanie pierwszego uruchomienia

```typescript
// Klucz w AsyncStorage
const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

// Sprawdzanie statusu
const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
if (completed !== 'true') {
  // Pokaż onboarding
}
```

### Flow nawigacji

```
Pierwsze uruchomienie (niezalogowany użytkownik)
├── Onboarding nie ukończony → /onboarding
│   ├── Pomiń → /login
│   └── Ukończ → /register
└── Onboarding ukończony → /login

Użytkownik zalogowany
└── → /(tabs) (pomiń onboarding)
```

## Struktura plików

```
app/
├── onboarding.tsx           # Główny komponent onboardingu
├── _layout.tsx             # Logika routingu z onboardingiem
└── (auth)/
    ├── login.tsx           # Ekran logowania
    └── register.tsx        # Ekran rejestracji

locales/
├── pl/translation.json     # Polskie tłumaczenia
└── en/translation.json     # Angielskie tłumaczenia
```

## Tłumaczenia

### Klucze w translation.json

```json
{
  "onboarding": {
    "skip": "Pomiń / Skip",
    "next": "Dalej / Next",
    "back": "Wstecz / Back",
    "getStarted": "Rozpocznij / Get Started",
    "hasAccount": "Masz już konto? / Already have an account?",
    "login": "Zaloguj się / Log in",
    "slide1": {
      "title": "...",
      "description": "..."
    }
  }
}
```

## Komponenty UI

### Główne elementy

1. **Logo Aisello** - na górze ekranu
2. **Przycisk "Pomiń"** - prawy górny róg (slajdy 1-3)
3. **Emoji** - duża ikona reprezentująca slajd
4. **Tytuł** - główny nagłówek
5. **Opis** - szczegółowy tekst
6. **Wskaźnik kropek** - pokazuje postęp (1/4, 2/4, itd.)
7. **Przyciski nawigacji** - "Wstecz" i "Dalej"/"Rozpocznij"

### Animacje

- **FadeIn** - pojawianie się elementów
- **FadeInDown** - wjeżdżanie z góry
- **FadeInRight** - przesuwanie między slajdami
- **FadeOut** - zanikanie przy przejściu

## Konfiguracja

### Dodawanie nowego slajdu

```typescript
const slides: OnboardingSlide[] = [
  // ... istniejące slajdy
  {
    id: 5,
    emoji: '💡',
    titleKey: 'onboarding.slide5.title',
    descriptionKey: 'onboarding.slide5.description',
    gradient: ['#fa709a', '#fee140'], // Nowy gradient
  },
];
```

### Zmiana gradientów

Aktualne gradienty można znaleźć na:
- [uiGradients](https://uigradients.com/)
- [WebGradients](https://webgradients.com/)

## Reset onboardingu (dla testowania)

### Opcja 1: Przez kod
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Reset onboarding status
await AsyncStorage.removeItem('@onboarding_completed');
```

### Opcja 2: Wyczyść dane aplikacji
- **iOS:** Usuń i zainstaluj ponownie aplikację
- **Android:** Settings → Apps → YourApp → Clear Data

### Opcja 3: Dodaj przycisk deweloperski

Możesz dodać przycisk w ekranie profilu (tylko dla development):

```tsx
// W profilu (tylko dla __DEV__)
{__DEV__ && (
  <DuolingoButton
    title="Reset Onboarding"
    onPress={async () => {
      await AsyncStorage.removeItem('@onboarding_completed');
      router.replace('/onboarding');
    }}
  />
)}
```

## Testowanie

### Scenariusze do przetestowania

✅ **Pierwszy raz - niezalogowany**
1. Usuń aplikację i zainstaluj ponownie
2. Uruchom - powinien pokazać się onboarding
3. Przejdź przez wszystkie slajdy
4. Kliknij "Rozpocznij" - powinno przekierować do rejestracji

✅ **Pominięcie onboardingu**
1. Na którymś slajdzie kliknij "Pomiń"
2. Powinno przekierować do logowania
3. Onboarding nie pokaże się ponownie

✅ **Użytkownik zalogowany**
1. Zaloguj się
2. Wyloguj
3. Onboarding nie powinien się pokazać

✅ **Nawigacja "Wstecz"**
1. Przejdź do slajdu 2 lub dalej
2. Kliknij "Wstecz"
3. Powinno wrócić do poprzedniego slajdu

✅ **Wielojęzyczność**
1. Przejdź przez onboarding w języku polskim
2. Usuń dane, zmień język systemu na angielski
3. Onboarding powinien wyświetlić się po angielsku

## Personalizacja

### Zmiana kolorów przycisków

Edytuj w `app/onboarding.tsx`:

```typescript
const styles = StyleSheet.create({
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Przezroczystość tła
  },
  // ...
});
```

### Zmiana czasu animacji

```typescript
entering={FadeInDown.delay(300).duration(600)}
//                    ↑ opóźnienie  ↑ czas trwania
```

## Najlepsze praktyki

1. **Krótkie teksty** - użytkownik powinien przeczytać w 3-5 sekund
2. **Konkretne korzyści** - pokaż co użytkownik zyska
3. **Wizualizacje** - używaj emoji/ikon zamiast długich tekstów
4. **Możliwość pominięcia** - zawsze daj opcję Skip
5. **Call to Action** - jasny przycisk na końcu

## Troubleshooting

### Problem: Onboarding pokazuje się za każdym razem
**Rozwiązanie:** Sprawdź czy AsyncStorage zapisuje wartość poprawnie

```typescript
// Sprawdź w konsoli
AsyncStorage.getItem('@onboarding_completed').then(console.log);
```

### Problem: Onboarding nie pokazuje się wcale
**Rozwiązanie:** Sprawdź routing w `_layout.tsx`

```typescript
console.log('Onboarding complete:', onboardingComplete);
console.log('Is authenticated:', isAuthenticated);
```

### Problem: Animacje nie działają płynnie
**Rozwiązanie:** Upewnij się że `react-native-reanimated` jest poprawnie skonfigurowany

## Przyszłe ulepszenia

- [ ] Możliwość swipe między slajdami
- [ ] Video/Lottie animacje zamiast emoji
- [ ] Interaktywne elementy (np. przycisk do wypróbowania)
- [ ] Personalizacja onboardingu w zależności od typu użytkownika
- [ ] Analytics - śledzenie ile osób pomija onboarding




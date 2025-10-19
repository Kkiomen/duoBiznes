# Wielojęzyczność aplikacji (i18n)

## Przegląd

Aplikacja została w pełni przygotowana do obsługi wielu języków przy użyciu:
- **i18next** - główna biblioteka do internacjonalizacji
- **react-i18next** - integracja z React
- **expo-localization** - wykrywanie języka urządzenia

## Obsługiwane języki

- 🇵🇱 Polski (pl) - domyślny
- 🇬🇧 Angielski (en)

## Struktura plików

```
locales/
├── i18n.ts                      # Konfiguracja i18n
├── pl/
│   └── translation.json         # Polskie tłumaczenia
└── en/
    └── translation.json         # Angielskie tłumaczenia
```

## Konfiguracja

### 1. Główna konfiguracja (locales/i18n.ts)

Plik konfiguracyjny automatycznie wykrywa język urządzenia użytkownika i ustawia go jako domyślny. Jeśli język nie jest obsługiwany, używany jest polski jako fallback.

### 2. Context (contexts/LanguageContext.tsx)

`LanguageContext` zapewnia:
- Dostęp do funkcji tłumaczenia `t()`
- Funkcję zmiany języka `changeLanguage()`
- Aktualnie wybrany język `language`
- Zapisywanie preferencji językowych w AsyncStorage

## Użycie w komponentach

### Podstawowe użycie

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <Text>{t('common.loading')}</Text>
  );
}
```

### Z interpolacją

```tsx
const { t } = useLanguage();

// Użycie zmiennych
<Text>{t('home.courses.lessons', { count: 10 })}</Text>
// Wynik: "10 lekcji" lub "10 lessons"
```

### Zmiana języka

```tsx
const { language, changeLanguage } = useLanguage();

// Zmiana na angielski
await changeLanguage('en');

// Zmiana na polski
await changeLanguage('pl');
```

## Struktura tłumaczeń

Tłumaczenia są zorganizowane w logiczne grupy:

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "retry": "Try again"
  },
  "auth": {
    "login": {
      "title": "Welcome back!",
      "subtitle": "Log in to continue learning"
    }
  },
  "home": {
    "tagline": "Learn business with AI",
    "courses": {
      "title": "📚 Available courses"
    }
  }
}
```

## Przełącznik języka

Przełącznik języka znajduje się w:
- **Ekran profilu** - użytkownik może zmienić język aplikacji

Zaimplementowany jako dwa przyciski z flagami:
- 🇵🇱 Polski
- 🇬🇧 English

## Przetłumaczone obszary

✅ **Ekrany uwierzytelniania**
- Login
- Rejestracja (wieloetapowa)

✅ **Nawigacja**
- Wszystkie etykiety tabs

✅ **Ekran główny**
- Sekcja kursów
- Sekcja dla firm
- Wszystkie komunikaty

✅ **Ekran profilu**
- Statystyki
- Osiągnięcia
- Postęp nauki
- Przełącznik języka

✅ **Komponenty UI**
- Loading screen
- Error screen
- Lesson success

✅ **Komponenty lekcji**
- Nagłówek lekcji
- Ekran sukcesu

## Dodawanie nowych tłumaczeń

### 1. Dodaj klucze do plików JSON

**locales/pl/translation.json:**
```json
{
  "myFeature": {
    "title": "Mój tytuł",
    "description": "Mój opis"
  }
}
```

**locales/en/translation.json:**
```json
{
  "myFeature": {
    "title": "My title",
    "description": "My description"
  }
}
```

### 2. Użyj w komponencie

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyFeature() {
  const { t } = useLanguage();
  
  return (
    <>
      <Text>{t('myFeature.title')}</Text>
      <Text>{t('myFeature.description')}</Text>
    </>
  );
}
```

## Najlepsze praktyki

1. **Używaj zagnieżdżonej struktury** - grupuj powiązane tłumaczenia
2. **Nazwy kluczy** - używaj camelCase dla kluczy
3. **Interpolacja** - używaj `{{variable}}` dla dynamicznych wartości
4. **Kontekst** - dodawaj kontekst do nazw kluczy (np. `auth.login.title`)
5. **Spójność** - utrzymuj tę samą strukturę w obu plikach językowych

## Przykłady interpolacji

```tsx
// Proste zmienne
t('profile.joinedDate', { date: '2024' })

// Liczby
t('home.courses.lessons', { count: 10 })

// Wiele zmiennych
t('profile.stats.completed', { current: 5, total: 10 })
```

## Testowanie

Aby przetestować różne języki:

1. Otwórz ekran profilu
2. Kliknij na przycisk języka (🇵🇱 lub 🇬🇧)
3. Aplikacja automatycznie przetłumaczy wszystkie teksty

## Rozszerzanie o nowe języki

Aby dodać nowy język (np. niemiecki):

1. Utwórz folder `locales/de/`
2. Skopiuj `translation.json` i przetłumacz
3. Dodaj do konfiguracji w `locales/i18n.ts`:
```typescript
import translationDE from './de/translation.json';

const resources = {
  pl: { translation: translationPL },
  en: { translation: translationEN },
  de: { translation: translationDE }, // nowy język
};
```
4. Zaktualizuj typ w `LanguageContext.tsx`:
```typescript
type Language = 'pl' | 'en' | 'de';
```
5. Dodaj przycisk w ekranie profilu

## Wsparcie techniczne

W przypadku problemów:
- Sprawdź czy wszystkie klucze istnieją w obu plikach językowych
- Upewnij się że `LanguageProvider` opakowuje całą aplikację
- Sprawdź konsolę pod kątem błędów i18n


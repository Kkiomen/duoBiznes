# System Lekcji n8n - Instrukcja Użytkowania

## 🎓 Przegląd

System lekcji to kompleksowe rozwiązanie do nauki n8n w stylu Duolingo, zawierające:
- **6 pełnych lekcji** (65 kroków łącznie)
- **360 XP** do zdobycia
- **13 typów interaktywnych ćwiczeń**
- **Ładowanie z JSON** (gotowe pod API)

## 🚀 Jak używać systemu

### Dla użytkownika końcowego:

1. **Wejdź w aplikację** i przejdź do zakładki "Nauka" (📚)
2. **Wybierz węzeł lekcji** na ścieżce (np. "Czym jest n8n?")
3. **Kliknij "Rozpocznij"** aby rozpocząć lekcję
4. **Przejdź przez wszystkie kroki**:
   - Czytaj treści edukacyjne (story, info, tip, example)
   - Wykonuj ćwiczenia interaktywne (quizy, drag & drop, etc.)
   - Zdobywaj XP za poprawne odpowiedzi
5. **Ukończ lekcję** i wróć do ścieżki

### Dostępne typy kroków:

#### Treści edukacyjne (bez XP):
- **story** - Historia z postacią Anią
- **info** - Karta informacyjna z punktami
- **tip** - Wskazówka/pro tip
- **example** - Przykład krok po kroku
- **diagram** - Wizualizacja node'ów workflow
- **challenge-intro** - Wprowadzenie do wyzwania

#### Ćwiczenia interaktywne (z XP):
- **multiple-choice** - Wybór wielokrotny (10-15 XP)
- **true-false** - Prawda/fałsz (10 XP)
- **match-pairs** - Dopasuj pary (15-20 XP)
- **drag-sequence** - Ułóż w kolejności (15-25 XP)
- **node-picker** - Wybierz właściwy node (10-15 XP)
- **fill-blank** - Uzupełnij lukę (10-15 XP)
- **swipe-cards** - Przesuń kartę (10 XP)
- **translate** - Przetłumacz (10 XP)

## 📝 Jak dodać nową lekcję

### Krok 1: Utwórz plik JSON

Stwórz nowy plik w `/data/lessons/`, np. `lesson-7-nowa-lekcja.json`:

```json
{
  "moduleId": "n8n-lesson-7",
  "moduleTitle": "Tytuł Nowej Lekcji",
  "character": "👩‍💼",
  "characterName": "Ania",
  "totalXP": 50,
  "lessons": [
    {
      "id": 1,
      "type": "story",
      "content": {
        "character": "👩‍💼",
        "characterName": "Ania",
        "story": "Treść historii..."
      }
    },
    {
      "id": 2,
      "type": "multiple-choice",
      "xp": 10,
      "content": {
        "question": "Pytanie?",
        "options": [
          { "text": "Odpowiedź A", "icon": "🔵" },
          { "text": "Odpowiedź B", "icon": "🟢" }
        ],
        "correctAnswer": 0
      }
    }
  ]
}
```

**Ważne:**
- `totalXP` musi być równe sumie `xp` ze wszystkich kroków interaktywnych
- Każdy krok musi mieć unikalny `id`
- Typy kroków muszą być zgodne z dostępnymi komponentami

### Krok 2: Dodaj do hooka

W pliku `/hooks/use-lesson-data.ts` dodaj mapowanie:

```typescript
const moduleFiles: Record<string, any> = {
  // ... istniejące ...
  'n8n-lesson-7': require('@/data/lessons/lesson-7-nowa-lekcja.json'),
};
```

### Krok 3: Dodaj węzeł na ścieżce

W pliku `/app/(tabs)/nowe.tsx`:

1. Dodaj nowy węzeł do listy:
```typescript
const [nodes] = useState<NodeData[]>([
  // ... istniejące ...
  { id: 14, type: 'lesson', icon: '🎯', title: 'Nowa Lekcja', state: 'locked', stars: 0, xp: 50 },
]);
```

2. Dodaj mapowanie:
```typescript
const lessonMapping: Record<number, string> = {
  // ... istniejące ...
  14: 'n8n-lesson-7',
};
```

### Krok 4: Przetestuj

```bash
node -e "
const data = require('./data/lessons/lesson-7-nowa-lekcja.json');
console.log('✅ Lekcja:', data.moduleTitle);
console.log('   Kroków:', data.lessons.length);
console.log('   XP:', data.totalXP);
"
```

## 🔌 Jak przełączyć na API

System jest już przygotowany pod API! Wystarczy zmienić funkcję w `/hooks/use-lesson-data.ts`:

### Obecnie (lokalne pliki):

```typescript
async function loadLocalLesson(moduleId: string): Promise<LessonModule | null> {
  const moduleFiles: Record<string, any> = {
    'n8n-lesson-1': require('@/data/lessons/lesson-1-czym-jest-n8n.json'),
    // ...
  };
  return moduleFiles[moduleId] || null;
}
```

### Przyszłość (API):

```typescript
async function loadLessonFromAPI(moduleId: string): Promise<LessonModule | null> {
  try {
    const response = await fetch(`https://api.example.com/lessons/${moduleId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: LessonModule = await response.json();
    return data;
  } catch (err) {
    console.error('Error loading lesson from API:', err);
    return null;
  }
}
```

Następnie w hooku `useLessonData` zamień:
```typescript
const lessonData = await loadLocalLesson(moduleId);
```
na:
```typescript
const lessonData = await loadLessonFromAPI(moduleId);
```

**Format odpowiedzi API musi być identyczny z plikami JSON!**

## 🧪 Jak testować

### Test 1: Walidacja JSON

```bash
node -e "
const fs = require('fs');
const file = 'lesson-1-czym-jest-n8n.json';
const data = JSON.parse(fs.readFileSync('data/lessons/' + file, 'utf8'));
const xp = data.lessons.reduce((sum, s) => sum + (s.xp || 0), 0);
console.log(xp === data.totalXP ? '✅ XP poprawne' : '❌ XP błędne');
"
```

### Test 2: Kompilacja TypeScript

```bash
npx tsc --noEmit --skipLibCheck
```

### Test 3: ESLint

```bash
npx eslint app/(tabs)/nowe.tsx hooks/use-lesson-data.ts
```

### Test 4: Ręczny test w aplikacji

1. Uruchom aplikację: `npx expo start`
2. Wejdź w zakładkę "Nauka"
3. Kliknij węzeł "Czym jest n8n?"
4. Przejdź przez całą lekcję
5. Sprawdź czy:
   - Wszystkie kroki się ładują
   - Ćwiczenia działają
   - XP jest naliczane
   - Przycisk "Zakończ" działa

## 📊 Struktura plików

```
duoBiznes/
├── app/
│   ├── (tabs)/
│   │   └── nowe.tsx              # Zakładka "Nauka" ze ścieżką
│   └── lesson-n8n.tsx             # Ekran realizacji lekcji
├── components/
│   └── lesson-types/              # Komponenty typów kroków (14 plików)
├── data/
│   └── lessons/                   # Pliki JSON z lekcjami
│       ├── lesson-1-czym-jest-n8n.json
│       ├── lesson-2-podstawy-workflow.json
│       ├── lesson-3-nody-w-n8n.json
│       ├── lesson-4-webhook-triggery.json
│       ├── lesson-5-praca-z-danymi.json
│       ├── lesson-6-pierwszy-workflow.json
│       └── README.md              # Dokumentacja lekcji
├── hooks/
│   └── use-lesson-data.ts         # Hook do ładowania lekcji
└── types/
    └── lesson.ts                  # Typy TypeScript
```

## 🐛 Troubleshooting

### Problem: Lekcja się nie ładuje

**Rozwiązanie:**
1. Sprawdź czy plik JSON istnieje w `/data/lessons/`
2. Sprawdź czy `moduleId` jest dodany w `use-lesson-data.ts`
3. Sprawdź czy węzeł ma poprawne mapowanie w `nowe.tsx`

### Problem: Błąd TypeScript

**Rozwiązanie:**
1. Sprawdź czy struktura JSON pasuje do typów w `/types/lesson.ts`
2. Sprawdź czy wszystkie pola wymagane są wypełnione

### Problem: XP się nie zgadza

**Rozwiązanie:**
1. Zsumuj `xp` ze wszystkich kroków interaktywnych
2. Upewnij się, że `totalXP` jest równe tej sumie
3. Zaktualizuj wartość `xp` w węźle w `nowe.tsx`

## 📚 Przykłady typów kroków

### Multiple Choice
```json
{
  "id": 1,
  "type": "multiple-choice",
  "xp": 10,
  "content": {
    "question": "Pytanie?",
    "options": [
      { "text": "Opcja 1", "icon": "🔵" },
      { "text": "Opcja 2", "icon": "🟢" }
    ],
    "correctAnswer": 0
  }
}
```

### Fill Blank
```json
{
  "id": 2,
  "type": "fill-blank",
  "xp": 15,
  "content": {
    "sentence": "n8n używa formatu ___",
    "placeholder": "Wpisz format...",
    "correctAnswer": "JSON"
  }
}
```

### Drag Sequence
```json
{
  "id": 3,
  "type": "drag-sequence",
  "xp": 20,
  "content": {
    "items": [
      { "text": "Webhook", "icon": "🪝" },
      { "text": "Set", "icon": "⚙️" },
      { "text": "Email", "icon": "📧" }
    ],
    "initialOrder": [2, 0, 1],
    "correctOrder": [0, 1, 2]
  }
}
```

## 🎯 Best Practices

1. **Proporcje treści**: 40% edukacyjne, 60% ćwiczenia
2. **Długość lekcji**: 10-15 kroków (15-30 minut)
3. **XP**: 40-105 punktów na lekcję
4. **Progresja**: Od prostych do złożonych
5. **Historia**: Używaj postaci Ani dla kontekstu
6. **Nazewnictwo**: Opisowe tytuły kroków
7. **Walidacja**: Testuj każdą lekcję przed publikacją

## 📞 Wsparcie

Jeśli masz pytania lub problemy:
1. Sprawdź dokumentację w `/data/lessons/README.md`
2. Zobacz typy w `/types/lesson.ts`
3. Przejrzyj przykładowe lekcje w `/data/lessons/`

---

**System jest gotowy do użycia!** 🎉


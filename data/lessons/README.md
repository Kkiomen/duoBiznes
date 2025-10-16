# Lekcje n8n - Dokumentacja

## Przegląd
System zawiera 6 osobnych lekcji modułu n8n, każda z własną treścią edukacyjną, ćwiczeniami i systemem XP.

## Struktura lekcji

### 1. Czym jest n8n? (`lesson-1-czym-jest-n8n.json`)
- **Module ID**: `n8n-lesson-1`
- **XP**: 50
- **Treść**: Wprowadzenie do n8n, automatyzacja workflow, zalety no-code
- **Ćwiczenia**: 10 kroków (story, info, multiple-choice, true-false, example, tip, swipe-cards)

### 2. Podstawy Workflow (`lesson-2-podstawy-workflow.json`)
- **Module ID**: `n8n-lesson-2`
- **XP**: 50
- **Treść**: Czym jest workflow, elementy workflow, triggery
- **Ćwiczenia**: 10 kroków (info, diagram, multiple-choice, true-false, match-pairs, example, tip, swipe-cards)

### 3. Node'y w n8n (`lesson-3-nody-w-n8n.json`)
- **Module ID**: `n8n-lesson-3`
- **XP**: 60
- **Treść**: Rodzaje node'ów (HTTP Request, Webhook, Set, IF, Email)
- **Ćwiczenia**: 10 kroków (info, multiple-choice, diagram, match-pairs, node-picker, example, tip, drag-sequence)

### 4. Webhook i Triggery (`lesson-4-webhook-triggery.json`)
- **Module ID**: `n8n-lesson-4`
- **XP**: 50
- **Treść**: Jak działają webhooks, automatyczne uruchamianie workflow
- **Ćwiczenia**: 10 kroków (story, info, multiple-choice, example, fill-blank, true-false, tip, swipe-cards)

### 5. Praca z danymi (`lesson-5-praca-z-danymi.json`)
- **Module ID**: `n8n-lesson-5`
- **XP**: 60
- **Treść**: Wyrażenia {{ $json }}, dostęp do danych, transformacje
- **Ćwiczenia**: 10 kroków (story, info, example, fill-blank, multiple-choice, diagram, tip, match-pairs)

### 6. Budowanie pierwszego workflow (`lesson-6-pierwszy-workflow.json`)
- **Module ID**: `n8n-lesson-6`
- **XP**: 100
- **Treść**: Kompleksowy przykład e-commerce, praktyczne zastosowania
- **Ćwiczenia**: 15 kroków (challenge-intro, story, info, example, diagram, drag-sequence, node-picker, multiple-choice, match-pairs, tip, swipe-cards)

## Mapowanie węzłów na lekcje

W pliku `app/(tabs)/nowe.tsx` wszystkie 13 węzłów są mapowane na lekcje:

| ID | Tytuł | Typ | Module ID | XP |
|----|-------|-----|-----------|-----|
| 1 | Czym jest n8n? | lesson | `n8n-lesson-1` | 50 |
| 2 | Podstawy Workflow | lesson | `n8n-lesson-2` | 50 |
| 3 | Historia Ani | character | `n8n-lesson-1` | 30 |
| 4 | Node'y w n8n | lesson | `n8n-lesson-3` | 60 |
| 5 | Dopasuj node'y | practice | `n8n-lesson-3` | 40 |
| 6 | Webhook i Triggery | lesson | `n8n-lesson-4` | 50 |
| 7 | Zbuduj workflow | practice | `n8n-lesson-6` | 60 |
| 8 | Node IF | practice | `n8n-lesson-3` | 50 |
| 9 | Praca z danymi | lesson | `n8n-lesson-5` | 60 |
| 10 | Wskazówki | character | `n8n-lesson-5` | 20 |
| 11 | Pierwszy workflow | lesson | `n8n-lesson-6` | 100 |
| 12 | Ćwicz składnię | practice | `n8n-lesson-5` | 50 |
| 13 | Finałowe wyzwanie | review | `n8n-lesson-6` | 100 |

**Uwaga:** Niektóre węzły (practice, character, review) kierują do tych samych lekcji co główne węzły lesson, ponieważ zawierają odpowiednie ćwiczenia i treści.

## Jak działa system?

1. **Użytkownik klika węzeł** w zakładce "Nauka" (`nowe.tsx`)
2. **System mapuje** ID węzła na odpowiedni `moduleId` (funkcja `getModuleIdForNode`)
3. **Router przekierowuje** do `/lesson-n8n?moduleId=n8n-lesson-X`
4. **Hook `useLessonData`** ładuje odpowiedni plik JSON
5. **Komponent `lesson-n8n.tsx`** renderuje lekcję krok po kroku

## Przygotowanie pod API

Hook `hooks/use-lesson-data.ts` jest już przygotowany pod przyszłe API:

### Obecnie (lokalnie):
```typescript
const moduleFiles: Record<string, any> = {
  'n8n-lesson-1': require('@/data/lessons/lesson-1-czym-jest-n8n.json'),
  // ...
};
```

### Przyszłość (API):
```typescript
const response = await fetch(`https://api.example.com/lessons/${moduleId}`);
const data: LessonModule = await response.json();
```

Wystarczy zamienić funkcję `loadLocalLesson` na `fetchLessonFromAPI`.

## Struktura pliku JSON

Każdy plik lekcji ma następującą strukturę:

```json
{
  "moduleId": "n8n-lesson-X",
  "moduleTitle": "Nazwa lekcji",
  "character": "👩‍💼",
  "characterName": "Ania",
  "totalXP": 50,
  "lessons": [
    {
      "id": 1,
      "type": "story | info | multiple-choice | ...",
      "xp": 10,
      "content": { /* specyficzna struktura dla typu */ }
    }
  ]
}
```

## Typy lekcji

### Treści edukacyjne (bez XP):
- `story` - historia z postacią
- `info` - karta informacyjna z bulletami
- `tip` - wskazówka
- `example` - przykład krok po kroku
- `diagram` - wizualizacja node'ów
- `challenge-intro` - wprowadzenie do wyzwania

### Ćwiczenia interaktywne (z XP):
- `multiple-choice` - wybór wielokrotny (10-15 XP)
- `true-false` - prawda/fałsz (10 XP)
- `match-pairs` - dopasuj pary (15-20 XP)
- `drag-sequence` - ułóż kolejność (15-25 XP)
- `node-picker` - wybór node'a (10-15 XP)
- `fill-blank` - uzupełnij lukę (10-15 XP)
- `swipe-cards` - przesuń kartę (10 XP)
- `translate` - przetłumacz (10 XP)

## Statystyki

- **Łączna liczba lekcji**: 6
- **Łączne XP**: 370 punktów
- **Łączna liczba kroków**: 65
- **Proporcje**: ~40% treści edukacyjnych, ~60% ćwiczeń interaktywnych


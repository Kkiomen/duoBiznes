Braku# 📱 10 Typów Lekcji n8n - Dokumentacja

## Jak przetestować?
1. Otwórz aplikację
2. Przejdź do zakładki **Home**
3. Kliknij przycisk **"Rozpocznij test"**
4. Przejdź przez wszystkie 10 typów lekcji

---

## 📚 Typy Lekcji

### 1. **Multiple Choice** (Wielokrotny wybór)
- **Plik:** `components/lesson-types/multiple-choice.tsx`
- **Opis:** Wybierz poprawną odpowiedź z 4 opcji (karty z ikonami)
- **Use case:** Identyfikacja node'ów, wybór właściwego rozwiązania
- **Badge:** Niebieski "WIELOKROTNY WYBÓR"

### 2. **True/False** (Prawda/Fałsz)
- **Plik:** `components/lesson-types/true-false.tsx`
- **Opis:** Zdecyduj czy stwierdzenie jest prawdziwe czy fałszywe
- **Use case:** Szybkie pytania o koncepcje n8n
- **Badge:** Różowy "PRAWDA/FAŁSZ"

### 3. **Match Pairs** (Dopasuj pary)
- **Plik:** `components/lesson-types/match-pairs.tsx`
- **Opis:** Połącz node z jego funkcją (2 kolumny)
- **Use case:** Nauka co robi każdy node
- **Badge:** Fioletowy "DOPASUJ PARY"
- **Interakcja:** Tap lewy → tap prawy → match

### 4. **Drag Sequence** (Ułóż w kolejności)
- **Plik:** `components/lesson-types/drag-sequence.tsx`
- **Opis:** Użyj strzałek ▲▼ aby ułożyć workflow w prawidłowej kolejności
- **Use case:** Budowanie logiki workflow
- **Badge:** Pomarańczowy "UŁÓŻ W KOLEJNOŚCI"

### 5. **Node Picker** (Wybierz właściwy node)
- **Plik:** `components/lesson-types/node-picker.tsx`
- **Opis:** Dla danego zadania wybierz odpowiedni node n8n
- **Use case:** Praktyczne zastosowanie node'ów
- **Badge:** Zielony "WYBIERZ NODE"

### 6. **Fill Blank** (Uzupełnij lukę)
- **Plik:** `components/lesson-types/fill-blank.tsx`
- **Opis:** Wpisz brakujące słowo (input tekstowy)
- **Use case:** Składnia n8n, wyrażenia {{ $json.__ }}
- **Badge:** Pomarańczowy "UZUPEŁNIJ LUKĘ"

### 7. **Swipe Cards** (Przesuwanie kart)
- **Plik:** `components/lesson-types/swipe-cards.tsx`
- **Opis:** Tinder-style: ✅ jeśli prawda, ❌ jeśli fałsz
- **Use case:** Szybkie powtórki, gamifikacja
- **Badge:** Bursztynowy "SWIPE"
- **Animacja:** Fade out/in przy swipe

### 8. **Translate** (Tłumaczenie/Definicja)
- **Plik:** `components/lesson-types/translate.tsx`
- **Opis:** Wybierz prawidłowe tłumaczenie/użycie konceptu
- **Use case:** Rozumienie definicji, zastosowań
- **Format:** Zdanie + 3 opcje pionowo

### 9. **Code Snippet** (Fragment kodu)
- **Obecnie:** Używa `FillBlank`
- **Planowane:** Dedykowany komponent z syntax highlighting
- **Use case:** Wyrażenia n8n, JavaScript w node'ach

### 10. **Visual Flow** (Wizualizacja przepływu)
- **Obecnie:** Używa `MultipleChoice`
- **Planowane:** Interaktywny diagram
- **Use case:** Debugging, analiza workflow

---

## 🎨 Kolory Badge'ów

| Typ | Kolor | Hex |
|-----|-------|-----|
| Multiple Choice | Niebieski | `#1cb0f6` |
| True/False | Różowy | `#ec4899` |
| Match Pairs | Fioletowy | `#8b5cf6` |
| Drag Sequence | Pomarańczowy | `#f97316` |
| Node Picker | Zielony | `#10b981` |
| Fill Blank | Bursztynowy | `#ff9600` |
| Swipe Cards | Złoty | `#f59e0b` |

---

## 🚀 Następne kroki

Po przetestowaniu możesz:
1. Wybrać najlepsze typy
2. Dodać je do głównej ścieżki (`app/lesson.tsx`)
3. Rozbudować o content n8n
4. Dodać animacje i dźwięki
5. Połączyć z systemem punktów/streak

---

## 💡 Sugestie rozbudowy

### Audio/Voice
- React Native TTS (text-to-speech)
- Narrator opisuje workflow, user wybiera strukturę

### Build Mini Workflow
- Canvas z przeciąganiem node'ów
- Biblioteka: `react-native-gesture-handler` + `react-native-svg`

### Find the Bug
- Pokaż workflow z błędem
- User tapuje na problematyczny node

---

Wszystkie komponenty są w folderze: `components/lesson-types/`



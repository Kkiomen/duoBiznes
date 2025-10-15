# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**duoBiznes** is a React Native mobile application built with Expo Router that implements a Duolingo-style learning experience for teaching n8n automation, AI concepts, business. The app features gamified learning with multiple interactive lesson types, a skill tree progression system, and a polished UI with dark mode support.

## Technology Stack

- **Framework**: React Native with Expo (~54.0)
- **Router**: Expo Router v6 (file-based routing)
- **Language**: TypeScript (strict mode)
- **Navigation**: React Navigation v7 with bottom tabs
- **Animations**: React Native Reanimated v4
- **Gestures**: React Native Gesture Handler v2
- **Platform Support**: iOS, Android, Web

## Development Commands

### Running the App
```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Platform-specific starts
npm run android    # Launch on Android emulator/device
npm run ios        # Launch on iOS simulator/device
npm run web        # Launch in web browser
```

### Code Quality
```bash
npm run lint       # Run ESLint
```

## Architecture

### File-Based Routing Structure
The app uses Expo Router's file-based routing:

- `app/_layout.tsx` - Root layout with theme provider and navigation stack
- `app/(tabs)/_layout.tsx` - Bottom tab navigation configuration (Home, Ścieżka, Profil)
- `app/(tabs)/index.tsx` - Home screen (main entry point)
- `app/(tabs)/skills.tsx` - Skill tree/path screen with progression visualization
- `app/(tabs)/profile.tsx` - User profile screen
- `app/lesson.tsx` - Main lesson flow for AI/n8n learning
- `app/lesson-demo.tsx` - Demo showcasing all 10 lesson types

### Lesson System Architecture

The core of the app is a modular lesson system with 10 interactive lesson types:

1. **Multiple Choice** (`components/lesson-types/multiple-choice.tsx`) - Select from 4 card-based options with icons
2. **True/False** (`components/lesson-types/true-false.tsx`) - Binary choice for concept validation
3. **Match Pairs** (`components/lesson-types/match-pairs.tsx`) - Connect related concepts (two-column matching)
4. **Drag Sequence** (`components/lesson-types/drag-sequence.tsx`) - Reorder items using arrow buttons
5. **Node Picker** (`components/lesson-types/node-picker.tsx`) - Choose appropriate n8n node for a task
6. **Fill Blank** (`components/lesson-types/fill-blank.tsx`) - Text input for completing expressions
7. **Swipe Cards** (`components/lesson-types/swipe-cards.tsx`) - Tinder-style swipe for quick reviews
8. **Translate** (`components/lesson-types/translate.tsx`) - Select correct definition/usage
9. **Code Snippet** - Currently uses FillBlank, planned for syntax highlighting
10. **Visual Flow** - Currently uses MultipleChoice, planned for interactive diagrams

Each lesson type follows a consistent interface pattern:
```typescript
interface LessonStep {
  type: LessonType;
  data: any;  // Lesson-specific data structure
  correctAnswer: number | string | any;
}
```

### Shared UI Components

- `components/ui/lesson-header.tsx` - Progress bar, hearts, and gems display
- `components/ui/progress-bar.tsx` - Linear progress indicator
- `components/ui/skill-node.tsx` - Duolingo-style skill circles for the path screen
- `components/ui/duolingo-button.tsx` - Primary action button with variants (primary/disabled)
- `components/themed-view.tsx` & `components/themed-text.tsx` - Theme-aware base components

### Theme System

Centralized theme management in `constants/theme.ts`:

- **Colors**: Light/dark mode support with "candy" color palette (blue, green, yellow, pink, purple, orange)
- **Fonts**: Platform-specific font stacks (iOS system fonts, web fallbacks)
- Theme switching via `useColorScheme()` hook

Color scheme for lesson badges:
- Multiple Choice: `#1cb0f6` (blue)
- True/False: `#ec4899` (pink)
- Match Pairs: `#8b5cf6` (purple)
- Drag Sequence: `#f97316` (orange)
- Node Picker: `#10b981` (green)
- Fill Blank: `#ff9600` (amber)
- Swipe Cards: `#f59e0b` (gold)

### Path Alias Configuration

The project uses `@/` as a path alias pointing to the root directory:
```typescript
// tsconfig.json paths
"@/*": ["./*"]
```

Use this consistently: `import { Component } from '@/components/component'`

## Key Development Patterns

### Lesson Flow Pattern
Lessons follow a state machine pattern:
1. Display question/prompt
2. User interaction (selection/input)
3. Check answer (show result feedback)
4. Continue to next step
5. Success screen on completion

State management typically includes:
```typescript
const [step, setStep] = useState(0);
const [selected, setSelected] = useState<any>(null);
const [showResult, setShowResult] = useState(false);
```

### Haptic Feedback
Bottom tabs use `HapticTab` component for tactile feedback on press.

### Screen Navigation
- Stack navigation for lesson screens with card presentation
- Tab navigation for main app sections
- Modal presentation available for overlays

## Testing the Lesson System

To test all 10 lesson types:
1. Open the app
2. Navigate to **Home** tab
3. Click **"Rozpocznij test"** button
4. Go through all 10 lesson types in `lesson-demo.tsx`

Alternatively, test the main learning flow via `lesson.tsx` which demonstrates a subset of lesson types with AI-focused content.

## Content Structure

The app is currently themed around:
- **Primary**: n8n automation workflow concepts
- **Secondary**: AI fundamentals (LLM, tokens, prompting)

Content is hardcoded in lesson step arrays. Future expansion would involve:
- External content management
- Dynamic lesson loading
- Progress persistence
- Points/streak system integration

## Important Configuration

- **Expo New Architecture**: Enabled (`newArchEnabled: true` in app.json)
- **Typed Routes**: Enabled for type-safe navigation
- **React Compiler**: Experimental, enabled
- **Edge to Edge**: Android displays use edge-to-edge UI
- **Color Scheme**: Automatic (respects system dark mode)

## Platform-Specific Considerations

- **iOS**: Tab bar icons use SF Symbols via `IconSymbol` component
- **Android**: Custom icon implementation (non-iOS platforms)
- **Web**: Static output mode configured
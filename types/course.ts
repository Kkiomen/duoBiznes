// Typy dla różnych typów contentu lekcji

export interface MultipleChoiceContent {
  question: string;
  options: Array<{ text: string; icon: string }>;
  correctAnswer: number;
}

export interface TrueFalseContent {
  statement: string;
  correctAnswer: boolean;
}

export interface MatchPairsContent {
  pairs: Array<{
    left: string;
    right: string;
    leftIcon?: string;
  }>;
}

export interface DragSequenceContent {
  items: Array<{ text: string; icon: string }>;
  initialOrder: number[];
  correctOrder: number[];
}

export interface NodePickerContent {
  task: string;
  options: Array<{ name: string; icon: string }>;
  correctAnswer: number;
}

export interface FillBlankContent {
  sentence: string;
  placeholder: string;
  correctAnswer: string;
}

export interface SwipeCardsContent {
  statement: string;
  correctAnswer: boolean;
}

export interface TranslateContent {
  sentence: string;
  instruction: string;
  options: string[];
  correctAnswer?: number;
}

export interface InfoContent {
  icon: string;
  heading: string;
  text: string;
  bullets?: string[];
}

export interface StoryContent {
  character: string;
  characterName: string;
  story: string;
}

export interface DiagramContent {
  title: string;
  nodes: Array<{ icon: string; label: string }>;
}

export interface ExampleContent {
  title: string;
  steps: Array<{ icon: string; text: string }>;
}

export interface TipContent {
  tip: string;
}

export interface ChallengeIntroContent {
  title: string;
  description: string;
  emoji: string;
}

export interface ArticleContent {
  htmlContent: string;
}

// Union type dla wszystkich możliwych typów contentu
export type LessonContent =
  | MultipleChoiceContent
  | TrueFalseContent
  | MatchPairsContent
  | DragSequenceContent
  | NodePickerContent
  | FillBlankContent
  | SwipeCardsContent
  | TranslateContent
  | InfoContent
  | StoryContent
  | DiagramContent
  | ExampleContent
  | TipContent
  | ChallengeIntroContent
  | ArticleContent;

// Typy dla różnych typów lekcji
export type LessonType =
  | 'multiple-choice'
  | 'true-false'
  | 'match-pairs'
  | 'drag-sequence'
  | 'node-picker'
  | 'fill-blank'
  | 'swipe-cards'
  | 'translate'
  | 'info'
  | 'story'
  | 'diagram'
  | 'example'
  | 'tip'
  | 'challenge-intro'
  | 'article';

// Pojedynczy krok w lekcji
export interface LessonStep {
  id: number;
  type: LessonType;
  xp?: number;
  content: LessonContent;
}

// Moduł/Lekcja (np. "Czym jest n8n?")
export interface Module {
  id: number;
  moduleId: string;
  moduleTitle: string;
  character: string;
  characterName: string;
  totalXP: number;
  isLocked: boolean; // Dodane pole z API - określa czy moduł jest zablokowany
  lessons: LessonStep[];
}

// Rozdział (Chapter) zawierający wiele modułów
export interface Chapter {
  id: number;
  title: string;
  description: string;
  icon: string;
  order: number;
  isChapterLocked: boolean; // Dodane pole z API
  isChapterCompleted: boolean; // Dodane pole z API
  lessons: Module[];
}

// Główny kurs
export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  character: string;
  characterName: string;
  chapters: Chapter[];
}

// Response z API
export interface CourseApiResponse extends Course {}

// Helper type dla map lekcji
export interface LessonMap {
  [moduleId: string]: Module;
}

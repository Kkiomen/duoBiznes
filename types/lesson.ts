// Content types (czytanie)
export interface StoryContent {
  character: string;
  characterName?: string;
  story: string;
}

export interface InfoContent {
  icon: string;
  heading: string;
  text: string;
  bullets?: string[];
}

export interface TipContent {
  tip: string;
}

export interface ExampleContent {
  title: string;
  steps: { icon: string; text: string }[];
}

export interface DiagramContent {
  title: string;
  nodes: { icon: string; label: string }[];
}

export interface ChallengeIntroContent {
  title: string;
  description: string;
  emoji: string;
}

// Interactive lesson types (ćwiczenia)
export interface MultipleChoiceContent {
  question: string;
  options: { text: string; icon?: string }[];
  correctAnswer: number;
}

export interface TrueFalseContent {
  statement: string;
  correctAnswer: boolean;
}

export interface MatchPairsContent {
  pairs: { left: string; leftIcon?: string; right: string; rightIcon?: string }[];
}

export interface DragSequenceContent {
  items: { text: string; icon?: string }[];
  initialOrder: number[];
  correctOrder: number[];
}

export interface NodePickerContent {
  task: string;
  options: { name: string; icon: string }[];
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
  correctAnswer: number;
}

// Union type for all content types
export type LessonContent =
  | StoryContent
  | InfoContent
  | TipContent
  | ExampleContent
  | DiagramContent
  | ChallengeIntroContent
  | MultipleChoiceContent
  | TrueFalseContent
  | MatchPairsContent
  | DragSequenceContent
  | NodePickerContent
  | FillBlankContent
  | SwipeCardsContent
  | TranslateContent;

// Lesson step type
export type LessonType =
  // Content types
  | 'story'
  | 'info'
  | 'tip'
  | 'example'
  | 'diagram'
  | 'challenge-intro'
  // Interactive types
  | 'multiple-choice'
  | 'true-false'
  | 'match-pairs'
  | 'drag-sequence'
  | 'node-picker'
  | 'fill-blank'
  | 'swipe-cards'
  | 'translate';

// Single lesson step
export interface LessonStep {
  id: number;
  type: LessonType;
  title?: string;
  xp?: number; // Only for interactive lessons
  content: LessonContent;
}

// Complete module
export interface LessonModule {
  moduleId: string;
  moduleTitle: string;
  character?: string;
  characterName?: string;
  totalXP: number;
  lessons: LessonStep[];
}

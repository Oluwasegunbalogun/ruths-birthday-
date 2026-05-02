export interface Memory {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

export interface UserMessage {
  id: string;
  author: string;
  text: string;
  memory?: string;
  media?: MediaItem[];
  hint: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export type Contribution = {
  id: string;
  message: string;
  memory?: string;
  media?: MediaItem[];
  author_name?: string;
  hint: string;
  created_at: string;
};
export type Difficulty = 'Facile' | 'Moyen' | 'Difficile';

export interface Exercise {
  id: string;
  title: string;
  difficulty: Difficulty;
  stars: number;
  url: string;
  thumbnailDescription: string;
}

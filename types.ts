export interface StoryData {
  id: string;
  country: string;
  title: string;
  shortDescription: string;
  heroImage: string;
  audioUrl?: string; // Optional specific audio for this story
  chapters: Chapter[];
}

export interface Chapter {
  title: string;
  content: string;
  image?: string;
  caption?: string;
}

export enum RoutePath {
  HOME = '/',
  ABOUT = '/about',
  STORY = '/story/:id'
}
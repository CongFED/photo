export interface FeedbackItem {
  id: string;
  image: string;
  camera: string;
  caption: string;
  customer: string;
  location: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

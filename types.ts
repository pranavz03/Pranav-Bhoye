
export type WinGoDuration = '30s' | '1min' | '3min' | '5min';

export interface PredictionData {
  period: string;
  number: number;
  size: 'Big' | 'Small';
  color: 'Red' | 'Green' | 'Violet' | 'Red+Violet' | 'Green+Violet';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

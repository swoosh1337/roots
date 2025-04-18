
export interface Ritual {
  id: string;
  name: string;
  streak_count: number;
  status: 'active' | 'paused' | 'chained';
  last_completed?: string | null;
}

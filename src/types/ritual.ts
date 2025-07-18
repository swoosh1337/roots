
export type RitualStatus = 'active' | 'paused' | 'chained';

export interface Ritual {
  id: string;
  name: string;
  streak_count: number;
  status: RitualStatus;
  last_completed?: string | null;
  is_active?: boolean; // Explicit field for active state
  chain_id?: string | null; // Field for linking chained rituals
  chain_order?: number | null; // Position in the chain (0-based index)
}

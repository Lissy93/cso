
export type SnackCategory = 'sweet' | 'savory' | 'healthy' | 'drink';

export interface Snack {
  snack_id: string;
  snack_name: string;
  user_id: string;
  created_at: string;
  snack_category?: SnackCategory;
  snack_meta: string;
}

export type SnackVote = 'up' | 'down';

export interface Vote {
  vote_id: string;
  vote: SnackVote;
  snack_id: string;
  user_id: string;
  created_at: string;
}

export interface SnackWithVotes extends Snack {
  Votes: Vote[];
}

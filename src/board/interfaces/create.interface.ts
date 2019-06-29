import { Board } from './board.interface';

export interface CreateBoard {
  board: Board | null;
  error: string | null;
}

import { Board } from '../../board/interfaces/board.interface';

export interface ParseListdo {
  boardSlug: string;
  board?: Board;
  list?: string;
  address: string;
}

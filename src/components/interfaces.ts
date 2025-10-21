export interface FranchiseInterface {
  GraphTitle: string;
  Description: string;
  Movies: {
    Year: number;
    MovieTitle?: string;
    Ryan: number;
    Josh: number;
    Avg?: number;
    RyanMult: number;
    JoshMult: number;
  }[];
}

export interface GraphDataInterface {
  [key: string]: FranchiseInterface;
}
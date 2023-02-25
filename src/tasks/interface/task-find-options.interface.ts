interface TaskFindOptions {
  take?: number;
  skip?: number;
  relations?: { [key: string]: boolean };
  where?: {
    done?: boolean;
    user?: { id: number };
  };
}

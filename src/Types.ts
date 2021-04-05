export type Entry = {
  id: number;
  name: string;
  month: number;
  date: number;
  year?: number;
};

export type EntryWithoutId = Omit<Entry, "id">;

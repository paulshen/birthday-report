export type Entry = {
  id: number;
  name: string;
  month: number;
  date: number;
  year?: number;
};

export type EntryWithoutId = Omit<Entry, "id">;

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

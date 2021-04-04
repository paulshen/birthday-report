import React from "react";

type Entry = {
  name: string;
  month: number;
  date: number;
  year?: number;
};

const DATA: Entry[] = [
  { name: "Alice", month: 9, date: 25, year: 1991 },
  { name: "Bob", month: 3, date: 21, year: 1988 },
  { name: "Carol", month: 7, date: 28, year: 1993 },
];

const MONTHS = [
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

function formatDate(month: number, date: number) {
  return `${MONTHS[month - 1]} ${date}`;
}

function List() {
  return (
    <div>
      {DATA.map(({ name, month, date, year }, i) => (
        <div className="flex pb-0.5" key={i}>
          <div className="text-gray-400 w-32">{formatDate(month, date)}</div>
          <div>{name}</div>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="max-w-lg mx-auto pt-16">
      <List />
    </div>
  );
}

export default App;

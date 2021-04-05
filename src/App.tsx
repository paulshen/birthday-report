import classNames from "classnames";
import { differenceInCalendarDays, getDaysInYear, startOfDay } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Entry } from "./Types";

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

function List({ entries }: { entries: Entry[] }) {
  const entriesWithDaysAway = useMemo<
    [entry: Entry, daysAway: number][]
  >(() => {
    const today = startOfDay(new Date());
    const daysInYear = getDaysInYear(today);
    return entries.map((entry) => {
      const diff = differenceInCalendarDays(
        new Date(today.getFullYear(), entry.month - 1, entry.date),
        today
      );
      return [entry, diff < 0 ? diff + daysInYear : diff];
    });
  }, [entries]);
  const sortedEntries = useMemo(
    () => entriesWithDaysAway.sort((a, b) => a[1] - b[1]),
    [entriesWithDaysAway]
  );
  return (
    <div>
      {sortedEntries.map(([{ name, month, date, year }], i) => (
        <div className="flex pb-0.5" key={i}>
          <div className="text-gray-300 w-32">{formatDate(month, date)}</div>
          <div>{name}</div>
        </div>
      ))}
    </div>
  );
}

function AddBirthdayForm({
  addEntry,
  onClose: onCloseArg,
}: {
  addEntry: (entry: Entry) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [month, setMonth] = useState("1");
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");

  const [animateIn, setAnimateIn] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setAnimateIn(true), 0);
    return () => clearTimeout(timeout);
  }, []);
  const onClose = useCallback(() => {
    setAnimateIn(false);
    setTimeout(onCloseArg, 150);
  }, [onCloseArg]);

  return (
    <div
      className={classNames(
        "mb-4 transform transition-opacity",
        animateIn ? "opacity-100" : "opacity-0"
      )}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const entry: Entry = {
            name,
            month: parseInt(month),
            date: parseInt(date),
          };
          if (year !== "") {
            entry.year = parseInt(year);
          }
          addEntry(entry);
          onClose();
        }}
      >
        <div className="mb-2">
          <label className="text-2xs block mb-0.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-100 rounded p-2"
          />
        </div>
        <div className="flex mb-2">
          <div className="mr-4">
            <label className="block mb-0.5 text-2xs">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-gray-100 rounded p-2"
            >
              {MONTHS.map((month, i) => (
                <option value={i + 1} key={i}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="mr-4">
            <label className="block mb-0.5 text-2xs">Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-100 rounded p-2 w-12"
            />
          </div>
          <div>
            <label className="block mb-0.5 text-2xs">Year (optional)</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-gray-100 rounded p-2 w-20"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="bg-gray-700 text-white rounded px-4 py-2 mr-4"
          >
            Add birthday
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
            }}
            className="text-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function AddBirthday({ addEntry }: { addEntry: (entry: Entry) => void }) {
  const [showForm, setShowForm] = useState(false);
  const onClose = useCallback(() => setShowForm(false), [setShowForm]);
  return (
    <div className="pl-32">
      {showForm ? (
        <AddBirthdayForm addEntry={addEntry} onClose={onClose} />
      ) : (
        <button
          onClick={() => {
            setShowForm(true);
          }}
          className="text-gray-400"
        >
          + Add birthday
        </button>
      )}
    </div>
  );
}

function App() {
  const [entries, setEntries] = useState<Entry[]>(() => [...DATA]);
  const addEntry = useCallback(
    (entry: Entry) => {
      setEntries((entries) => [...entries, entry]);
    },
    [setEntries]
  );
  return (
    <div className="max-w-lg mx-auto pt-16">
      <AddBirthday addEntry={addEntry} />
      <List entries={entries} />
    </div>
  );
}

export default App;

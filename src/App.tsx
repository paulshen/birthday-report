import classNames from "classnames";
import { differenceInCalendarDays, getDaysInYear, startOfDay } from "date-fns";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Entry, EntryWithoutId } from "./Types";

const DATA: Entry[] = [
  { id: 1, name: "Alice", month: 9, date: 25, year: 1991 },
  { id: 2, name: "Bob", month: 3, date: 21, year: 1988 },
  { id: 3, name: "Carol", month: 7, date: 28, year: 1993 },
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
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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
  addEntry: (entry: EntryWithoutId) => void;
  onClose: () => void;
}) {
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [month, setMonth] = useState("1");
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const isNameTooShort = name.trim().length === 0;
  const dateInt = parseInt(date);
  const isDateValid =
    dateInt >= 1 && dateInt <= DAYS_IN_MONTH[parseInt(month) - 1];
  let isYearValid = year.trim() === "";
  if (!isYearValid) {
    const yearInt = parseInt(year);
    isYearValid = yearInt >= 1800 && yearInt <= new Date().getFullYear();
  }

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
          if (isNameTooShort || !isDateValid || !isYearValid) {
            setShowErrors(true);
            return;
          }
          setShowErrors(false);
          const entry: EntryWithoutId = {
            name,
            month: parseInt(month),
            date: parseInt(date),
          };
          if (year !== "") {
            entry.year = parseInt(year);
          }
          addEntry(entry);
          setName("");
          setMonth("1");
          setDate("");
          setYear("");
          nameInputRef.current!.focus();
        }}
      >
        <div className="mb-2">
          <label className="text-2xs block mb-0.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={classNames(
              "w-full bg-gray-100 rounded px-2 py-1.5 border transition-colors",
              showErrors && isNameTooShort
                ? "border-red-300"
                : "border-transparent"
            )}
            ref={nameInputRef}
          />
        </div>
        <div className="flex mb-2">
          <div className="mr-4">
            <label className="block mb-0.5 text-2xs">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-gray-100 rounded px-2 h-[34px] border border-transparent"
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
              className={classNames(
                "w-12 bg-gray-100 rounded px-2 py-1.5 border transition-colors",
                showErrors && !isDateValid
                  ? "border-red-300"
                  : "border-transparent"
              )}
            />
          </div>
          <div>
            <label className="block mb-0.5 text-2xs">Year (optional)</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={classNames(
                "w-20 bg-gray-100 rounded px-2 py-1.5 border transition-colors",
                showErrors && !isYearValid
                  ? "border-red-300"
                  : "border-transparent"
              )}
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

function AddBirthday({
  addEntry,
}: {
  addEntry: (entry: EntryWithoutId) => void;
}) {
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
    (entry: EntryWithoutId) => {
      setEntries((entries) => [
        ...entries,
        {
          ...entry,
          id:
            Math.max.apply(
              null,
              entries.map((e) => e.id)
            ) + 1,
        },
      ]);
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

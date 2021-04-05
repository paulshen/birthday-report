import classNames from "classnames";
import { differenceInCalendarDays, getDaysInYear, startOfDay } from "date-fns";
import React, { useEffect, useMemo, useRef, useState } from "react";
import editIconSvg from "./edit_black_18dp.svg";
import { Entry, MONTHS } from "./Types";

function formatDate(month: number, date: number) {
  return `${MONTHS[month - 1]} ${date}`;
}

function ListItemEdit({
  entry,
  updateEntry,
  deleteEntry,
  onClose,
}: {
  entry: Entry;
  updateEntry: (entry: Entry) => void;
  deleteEntry: (entryId: number) => void;
  onClose: () => void;
}) {
  const [animateIn, setAnimateIn] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setAnimateIn(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    nameInputRef.current!.focus();
  }, []);
  return (
    <div
      className={classNames(
        "bg-white border border-gray-100 absolute left-[131px] top-[-13px] -right-1 p-2 rounded shadow-lg transition-opacity",
        animateIn ? "opacity-100" : "opacity-0"
      )}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateEntry({
            ...entry,
            name: nameInputRef.current!.value,
          });
          onClose();
        }}
      >
        <div className="mb-2">
          <input
            type="text"
            defaultValue={entry.name}
            className="w-full bg-gray-100 rounded px-1 py-1"
            ref={nameInputRef}
          ></input>
        </div>
        <div className="flex items-center">
          <div className="flex flex-grow">
            <button
              type="submit"
              className="bg-gray-700 text-white px-2 py-1 rounded mr-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => onClose()}
              className="text-gray-300"
            >
              Cancel
            </button>
          </div>
          <button
            onClick={() => deleteEntry(entry.id)}
            className="text-red-400"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}

function ListItem({
  entry,
  updateEntry,
  deleteEntry,
}: {
  entry: Entry;
  updateEntry: (entry: Entry) => void;
  deleteEntry: (entryId: number) => void;
}) {
  const { name, month, date, year } = entry;
  const [showEdit, setShowEdit] = useState(false);
  return (
    <div
      className={classNames("flex pb-0.5 relative group", {
        "z-10": showEdit,
      })}
    >
      <div className="text-gray-300 w-36">{formatDate(month, date)}</div>
      <div className="relative">
        {name}
        <button
          onClick={() => {
            setShowEdit(true);
          }}
          className={classNames(
            "absolute right-full w-[18px] -top-px py-0.5 mr-1 text-gray-300 opacity-0 group-hover:opacity-25 hover:!opacity-100 transition-opacity",
            { hidden: showEdit }
          )}
        >
          <img src={editIconSvg} />
        </button>
      </div>
      {showEdit ? (
        <ListItemEdit
          entry={entry}
          updateEntry={updateEntry}
          deleteEntry={deleteEntry}
          onClose={() => setShowEdit(false)}
        />
      ) : null}
    </div>
  );
}

export function BirthdayList({
  entries,
  updateEntry,
  deleteEntry,
}: {
  entries: Entry[];
  updateEntry: (entry: Entry) => void;
  deleteEntry: (entryId: number) => void;
}) {
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
      {sortedEntries.map(([entry], i) => (
        <ListItem
          entry={entry}
          updateEntry={updateEntry}
          deleteEntry={deleteEntry}
          key={entry.id}
        />
      ))}
    </div>
  );
}

import classNames from "classnames";
import { differenceInCalendarDays, getDaysInYear, startOfDay } from "date-fns";
import React, { useEffect, useMemo, useRef, useState } from "react";
import editIconSvg from "./edit_black_18dp.svg";
import { Entry, SHORT_MONTHS } from "./Types";
import { LeftSpacer } from "./UI";
import { getBirthdayAge } from "./Utils";

function formatDate(month: number, date: number) {
  return `${SHORT_MONTHS[month - 1]} ${date}`;
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
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    nameInputRef.current!.focus();
  }, []);
  return (
    <div
      className={classNames(
        "bg-white border border-gray-100 absolute left-[-21px] top-[-21px] -right-1 p-4 rounded shadow-lg transition-opacity",
        animateIn ? "opacity-100" : "opacity-0"
      )}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await updateEntry({
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
            className="w-full font-medium bg-gray-100 rounded px-1 py-1"
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
              className="text-gray-300 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
          <button
            type="button"
            onClick={() => deleteEntry(entry.id)}
            className="text-red-400"
          >
            Remove
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

  const [animateIn, setAnimateIn] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setAnimateIn(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={classNames(
        "flex pb-0.5 relative group transition-opacity",
        animateIn ? "opacity-100" : "opacity-0",
        {
          "z-10": showEdit,
        }
      )}
    >
      <div className="text-gray-400 group-hover:text-gray-800 w-32 max-w-[25%] transition-colors">
        {formatDate(month, date)}
      </div>
      <div className="flex-grow relative">
        <span className="font-medium">{name}</span>
        {year !== undefined ? (
          <span className="text-gray-300 ml-1 group-hover:text-gray-800 transition-colors">
            ({getBirthdayAge(year, month, date)})
          </span>
        ) : null}
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
        {showEdit ? (
          <ListItemEdit
            entry={entry}
            updateEntry={updateEntry}
            deleteEntry={deleteEntry}
            onClose={() => setShowEdit(false)}
          />
        ) : null}
      </div>
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
    [entry: Entry, daysAway: number, isNextYear: boolean][]
  >(() => {
    const today = startOfDay(new Date());
    const daysInYear = getDaysInYear(today);
    return entries.map((entry) => {
      const diff = differenceInCalendarDays(
        new Date(today.getFullYear(), entry.month - 1, entry.date),
        today
      );
      return [entry, diff < 0 ? diff + daysInYear : diff, diff < 0];
    });
  }, [entries]);
  const sortedEntries = useMemo(
    () => entriesWithDaysAway.sort((a, b) => a[1] - b[1]),
    [entriesWithDaysAway]
  );
  const entriesNextYear = sortedEntries
    .filter(([_entry, _, isNextYear]) => isNextYear)
    .map(([entry], i) => (
      <ListItem
        entry={entry}
        updateEntry={updateEntry}
        deleteEntry={deleteEntry}
        key={entry.id}
      />
    ));
  return (
    <div>
      {sortedEntries
        .filter(([_entry, _, isNextYear]) => !isNextYear)
        .map(([entry], i) => (
          <ListItem
            entry={entry}
            updateEntry={updateEntry}
            deleteEntry={deleteEntry}
            key={entry.id}
          />
        ))}
      {entriesNextYear.length > 0 ? (
        <div className="flex">
          <div className="text-gray-200 font-medium pb-0.5">
            {new Date().getFullYear() + 1}
          </div>
        </div>
      ) : null}
      {entriesNextYear}
    </div>
  );
}

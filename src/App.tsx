import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BirthdayList } from "./BirthdayList";
import {
  deleteSupabaseEntry,
  initializeSupabase,
  insertSupabaseEntries,
  insertSupabaseEntry,
  login,
  logout,
  updateSupabaseEntry,
  useEntries,
  useUser,
} from "./State";
import { DAYS_IN_MONTH, Entry, EntryWithoutId, MONTHS } from "./Types";

const DATA: Entry[] = [
  { id: 1, name: "Alice", month: 9, date: 25, year: 1991 },
  { id: 2, name: "Bob", month: 3, date: 21, year: 1988 },
  { id: 3, name: "Carol", month: 7, date: 28, year: 1993 },
];

function AddBirthdayForm({
  insertEntry,
  onClose: onCloseArg,
}: {
  insertEntry: (entry: EntryWithoutId) => void;
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
    nameInputRef.current!.focus();
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
          insertEntry(entry);
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
  insertEntry,
}: {
  insertEntry: (entry: EntryWithoutId) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const onClose = useCallback(() => setShowForm(false), [setShowForm]);
  return (
    <div className="pl-36">
      {showForm ? (
        <AddBirthdayForm insertEntry={insertEntry} onClose={onClose} />
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
  const user = useUser().user;
  const entries = useEntries().entries;
  const isLoggedIn = user !== undefined;

  useEffect(() => {
    async function go() {
      const isSupabaseLoggingIn = location.hash.indexOf("access_token") !== -1;
      initializeSupabase();
      if (isSupabaseLoggingIn) {
        // supabase's handling of access_token is async
        // https://github.com/supabase/gotrue-js/blob/5690b208ee6f0fa5cf0cf55f5251a10a2bfe5e03/src/GoTrueClient.ts#L281
        const searchParams = new URLSearchParams(location.search);
        const loginEntriesQuery = searchParams.get("login_entries");
        if (loginEntriesQuery !== null) {
          // TODO: validate
          const loginEntries: Entry[] = JSON.parse(atob(loginEntriesQuery));
          history.replaceState({}, "", location.pathname);
          if (loginEntries.length > 0) {
            // we had some temporary entries. insert them on login.
            const unsubscribe = useEntries.subscribe(async (state) => {
              if (state.entries !== undefined) {
                unsubscribe();
                const entryIds = state.entries.map((e) => e.id);
                const entriesToInsert: Entry[] = [];
                // reassign IDs since we have fresh server entries
                loginEntries.forEach((loginEntry) => {
                  const id =
                    (entryIds.length > 0 ? Math.max(...entryIds) : 0) + 1;
                  entryIds.push(id);
                  entriesToInsert.push({ ...loginEntry, id });
                });
                const insertedEntries = await insertSupabaseEntries(
                  entriesToInsert
                );
                useEntries.setState({
                  entries: [
                    ...useEntries.getState().entries!,
                    ...insertedEntries,
                  ],
                });
              }
            });
          }
        }
      } else if (useUser.getState().user === undefined) {
        useEntries.setState({ entries: [] });
      }
    }
    go();
  }, []);
  const insertEntry = useCallback(
    async (entryWithoutId: EntryWithoutId) => {
      const entries = useEntries.getState().entries!;
      const id =
        (entries.length > 0 ? Math.max(...entries.map((e) => e.id)) : 0) + 1;
      const entry = { ...entryWithoutId, id };
      let entryToInsert = entry;
      if (isLoggedIn) {
        entryToInsert = await insertSupabaseEntry(entry);
      }
      useEntries.setState({
        entries: [...useEntries.getState().entries!, entry],
      });
    },
    [isLoggedIn]
  );
  const updateEntry = useCallback(
    async (entry: Entry) => {
      let entryToUpdate = entry;
      if (isLoggedIn) {
        entryToUpdate = await updateSupabaseEntry(entry);
      }
      useEntries.setState({
        entries: useEntries
          .getState()
          .entries!.map((e) => (e.id === entryToUpdate.id ? entryToUpdate : e)),
      });
    },
    [isLoggedIn]
  );
  const deleteEntry = useCallback(
    async (entryId: number) => {
      if (isLoggedIn) {
        await deleteSupabaseEntry(entryId);
      }
      useEntries.setState({
        entries: useEntries.getState().entries!.filter((e) => e.id !== entryId),
      });
    },
    [isLoggedIn]
  );

  if (entries === undefined) {
    // TODO: show loading
    return null;
  }

  return (
    <div className="max-w-md mx-auto pt-16">
      <AddBirthday insertEntry={insertEntry} />
      <BirthdayList
        entries={entries}
        updateEntry={updateEntry}
        deleteEntry={deleteEntry}
      />
      {!isLoggedIn ? (
        <button onClick={() => login()}>log in</button>
      ) : (
        <button onClick={() => logout()}>log out</button>
      )}
    </div>
  );
}

export default App;

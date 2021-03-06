import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { LayerContainer, TooltipConfigContext } from "react-atmosphere";
import { BirthdayCalendar } from "./BirthdayCalendar";
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
import { LeftSpacer } from "./UI";

function AddBirthdayForm({
  insertEntry,
  forceShow,
  onClose: onCloseArg,
}: {
  insertEntry: (entry: EntryWithoutId) => void;
  forceShow: boolean;
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

  const [animateIn, setAnimateIn] = useState(forceShow);
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
        "mb-8 transform transition-opacity",
        animateIn ? "opacity-100" : "opacity-0"
      )}
    >
      <form
        onSubmit={async (e) => {
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
          await insertEntry(entry);
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
              "w-full input-text bg-gray-100 rounded px-2 py-1.5 border transition-colors",
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
              className="input-text bg-gray-100 rounded px-2 h-[34px] border border-transparent"
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
              type="number"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={classNames(
                "w-12 input-text bg-gray-100 rounded px-2 py-1.5 border transition-colors",
                showErrors && !isDateValid
                  ? "border-red-300"
                  : "border-transparent"
              )}
            />
          </div>
          <div>
            <label className="block mb-0.5 text-2xs">Year (optional)</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={classNames(
                "w-16 input-text bg-gray-100 rounded px-2 py-1.5 border transition-colors",
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
          {!forceShow ? (
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="text-gray-400 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

function StartHere() {
  const [animationStage, setAnimationStage] = useState(0);
  useEffect(() => {
    setTimeout(() => setAnimationStage(1), 300);
    const timeout = setTimeout(() => setAnimationStage(2), 600);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div
      className={classNames(
        "mt-[23px] transition-opacity",
        animationStage > 0 ? "opacity-100" : "opacity-0"
      )}
    >
      Start here
      <span
        className={classNames(
          "inline-block transform transition-all",
          animationStage > 1 ? "translate-x-1 opacity-100" : "opacity-0"
        )}
      >
        ???
      </span>
    </div>
  );
}

function AddBirthday({
  forceShow,
  insertEntry,
}: {
  forceShow: boolean;
  insertEntry: (entry: EntryWithoutId) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  if (!showForm && forceShow) {
    setShowForm(true);
  }
  const onClose = useCallback(() => setShowForm(false), [setShowForm]);
  return (
    <div className="flex">
      <LeftSpacer>{forceShow ? <StartHere /> : null}</LeftSpacer>
      <div>
        {forceShow || showForm ? (
          <AddBirthdayForm
            insertEntry={insertEntry}
            forceShow={forceShow}
            onClose={onClose}
          />
        ) : (
          <button
            onClick={() => {
              setShowForm(true);
            }}
            className="text-gray-400 hover:text-gray-800 mb-0.5 transition-colors"
          >
            + Add birthday
          </button>
        )}
      </div>
    </div>
  );
}

function LoginNotice() {
  const [animateIn, setAnimateIn] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setAnimateIn(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex">
      <LeftSpacer />
      <div
        className={classNames(
          "mt-4 bg-red-100 text-xs p-2 rounded transition-opacity",
          animateIn ? "opacity-100" : "opacity-0"
        )}
      >
        <button className="underline" onClick={() => login()}>
          Log in
        </button>{" "}
        to save your birthday report! You will lose it otherwise when you close
        this browser tab.
      </div>
    </div>
  );
}

function Footer() {
  const user = useUser().user;
  return (
    <div className="flex mt-16 pb-16 text-gray-400">
      <LeftSpacer />
      <div>
        {user !== undefined ? (
          <div className="text-gray-400">You are {user.email}</div>
        ) : null}
        <div>
          {user === undefined ? (
            <button
              onClick={() => login()}
              className="hover:text-gray-700 hover:underline transition-colors"
            >
              Log in
            </button>
          ) : (
            <button
              onClick={() => logout()}
              className="hover:text-gray-800 hover:underline transition-colors"
            >
              Log out
            </button>
          )}
        </div>
        <div>
          <a
            href="https://github.com/paulshen/birthday-report"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-800 hover:underline transition-colors"
          >
            Source
          </a>
        </div>
        <div>
          {"By "}
          <a
            href="https://twitter.com/_paulshen"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-800 hover:underline transition-colors"
          >
            @_paulshen
          </a>
        </div>
      </div>
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
        entries: [...useEntries.getState().entries!, entryToInsert],
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
    <div className="max-w-lg mx-auto px-3 pt-16">
      <div className="flex mb-8">
        <LeftSpacer />
        <div>
          <div className="flex text-xl">
            <span className="">
              Bi
              <span style={{ letterSpacing: "2px" }}>r</span>
              thday.repo
              <span style={{ letterSpacing: "2px" }}>r</span>t
            </span>
            <span className="ml-2">????????</span>
          </div>
          <div className="text-xs text-gray-300">Stop forgetting birthdays</div>
        </div>
      </div>
      <AddBirthday forceShow={entries.length === 0} insertEntry={insertEntry} />
      <BirthdayList
        entries={entries}
        updateEntry={updateEntry}
        deleteEntry={deleteEntry}
      />
      {!isLoggedIn && entries.length > 0 ? <LoginNotice /> : null}
      <BirthdayCalendar entries={entries} />
      <Footer />
    </div>
  );
}

const TooltipConfig = {
  renderTooltip: (text: React.ReactNode) => (
    <div className="bg-gray-700 text-white px-2 py-1 rounded">{text}</div>
  ),
  options: {
    placement: "top" as const,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 4],
        },
      },
    ],
  },
};

export default function AppWrapper() {
  return (
    <TooltipConfigContext.Provider value={TooltipConfig}>
      <App />
      <div className="relative z-50">
        <LayerContainer />
      </div>
    </TooltipConfigContext.Provider>
  );
}

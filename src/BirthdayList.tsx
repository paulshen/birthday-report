import { differenceInCalendarDays, getDaysInYear, startOfDay } from "date-fns";
import React, { useMemo } from "react";
import { Entry, MONTHS } from "./Types";

function formatDate(month: number, date: number) {
  return `${MONTHS[month - 1]} ${date}`;
}

export function BirthdayList({ entries }: { entries: Entry[] }) {
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

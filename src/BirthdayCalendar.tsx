import React, { useCallback, useState } from "react";
import { MonthCalendar } from "./MonthCalendar";
import { Entry } from "./Types";

export function BirthdayCalendar({ entries }: { entries: Entry[] }) {
  const [yearMonth, setYearMonth] = useState<[year: number, month: number]>(
    () => [new Date().getFullYear(), new Date().getMonth() + 1]
  );
  const [year, month] = yearMonth;
  const renderCell = useCallback(
    (date: number) => {
      const e = entries.filter((e) => e.month === month && e.date === date);
      if (e.length === 0) {
        return null;
      }
      return (
        <div>
          {e.map(({ name }, i) => (
            <div key={i}>{name}</div>
          ))}
        </div>
      );
    },
    [month, entries]
  );

  return (
    <div>
      <div className="flex items-center">
        <button
          onClick={() => {
            setYearMonth(([year, month]) =>
              month === 1 ? [year - 1, 12] : [year, month - 1]
            );
          }}
          className="bg-gray-100 flex items-center justify-center w-8 h-8 mr-2"
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            setYearMonth(([year, month]) =>
              month === 12 ? [year + 1, 1] : [year, month + 1]
            );
          }}
          className="bg-gray-100 flex items-center justify-center w-8 h-8 mr-2"
        >
          {">"}
        </button>
        <div>
          {MONTHS[month - 1]} {year}
        </div>
      </div>
      <MonthCalendar year={year} month={month} renderCell={renderCell} />
    </div>
  );
}

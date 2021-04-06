import React, { useCallback, useState } from "react";
import { Tooltip } from "react-atmosphere";
import arrowBackSvg from "./arrow_back_black_18dp.svg";
import arrowForwardSvg from "./arrow_forward_black_18dp.svg";
import calendarIconSvg from "./calendar_today_black_18dp.svg";
import { MonthCalendar } from "./MonthCalendar";
import { Entry, MONTHS } from "./Types";

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
        <div className="flex flex-wrap">
          {e.map(({ name, year: birthYear }, i) => (
            <Tooltip
              text={`${name}${
                birthYear !== undefined ? ` (${year - birthYear})` : ""
              }`}
              key={i}
            >
              {(tooltipProps) => (
                <div
                  {...tooltipProps}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-2xs bg-gray-500 hover:bg-gray-800 transition-colors text-white uppercase mr-0.5 mb-0.5 cursor-default"
                >
                  {name[0]}
                </div>
              )}
            </Tooltip>
          ))}
        </div>
      );
    },
    [month, entries]
  );

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex text-gray-800">
          <img src={calendarIconSvg} className="mr-1" />
          {MONTHS[month - 1]} {year}
        </div>
        <div className="flex">
          <button
            onClick={() => {
              setYearMonth(([year, month]) =>
                month === 1 ? [year - 1, 12] : [year, month - 1]
              );
            }}
            className="flex p-1 mr-2 opacity-25 hover:opacity-100 transition-opacity"
          >
            <img src={arrowBackSvg} />
          </button>
          <button
            onClick={() => {
              setYearMonth(([year, month]) =>
                month === 12 ? [year + 1, 1] : [year, month + 1]
              );
            }}
            className="flex p-1 opacity-25 hover:opacity-100 transition-opacity"
          >
            <img src={arrowForwardSvg} />
          </button>
        </div>
      </div>
      <MonthCalendar year={year} month={month} renderCell={renderCell} />
    </div>
  );
}

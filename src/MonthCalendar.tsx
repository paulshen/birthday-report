import classNames from "classnames";
import { getDaysInMonth, isToday } from "date-fns";
import React, { useMemo } from "react";

function Week({
  startDate,
  startDay,
  year,
  month,
  daysInMonth,
  renderCell,
}: {
  startDate: number;
  startDay: number;
  year: number;
  month: number;
  daysInMonth: number;
  renderCell: (date: number) => React.ReactNode;
}) {
  const cells = [];
  let i = 0;
  for (; i < startDay; i++) {
    cells.push(<div className="calendar-cell" key={i} />);
  }
  for (; i < 7 && startDate + i <= daysInMonth; i++) {
    cells.push(
      <div
        className={classNames(
          "calendar-cell border border-t relative group hover:z-10 border-gray-200 hover:border-gray-500 p-1",
          {
            "bg-gray-100": isToday(
              new Date(year, month - 1, startDate + i - startDay)
            ),
          }
        )}
        key={i}
      >
        <div className="calendar-cell-spacer" />
        <div className="calendar-cell-contents">
          <div className="text-gray-300 font text-xs group-hover:text-gray-800">
            {startDate + i - startDay}
          </div>
          {renderCell(startDate + i - startDay)}
        </div>
      </div>
    );
  }
  for (; i < 7; i++) {
    cells.push(<div className="calendar-cell" key={i} />);
  }
  return <div className="flex pr-px">{cells}</div>;
}

export function MonthCalendar({
  year,
  month,
  renderCell,
}: {
  year: number;
  month: number;
  renderCell: (date: number) => React.ReactNode;
}) {
  const date = useMemo(() => new Date(year, month - 1), [year, month]);
  const daysInMonth = useMemo(() => getDaysInMonth(date), [date]);
  const startsOnDay = date.getDay();

  const weeks = [
    <Week
      startDate={1}
      startDay={startsOnDay}
      daysInMonth={daysInMonth}
      year={year}
      month={month}
      renderCell={renderCell}
      key={0}
    />,
  ];
  for (let i = 8 - startsOnDay; i <= daysInMonth; i += 7) {
    weeks.push(
      <Week
        startDate={i}
        startDay={0}
        year={year}
        month={month}
        daysInMonth={daysInMonth}
        renderCell={renderCell}
        key={i}
      />
    );
  }
  return <div>{weeks}</div>;
}

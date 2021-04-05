import classNames from "classnames";
import { getDaysInMonth } from "date-fns";
import React, { useMemo } from "react";

function Week({
  startDate,
  startDay,
  daysInMonth,
  renderCell,
}: {
  startDate: number;
  startDay: number;
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
        className={classNames("calendar-cell border-l border-t p-1", {
          "border-r": i === 6 || startDate + i === daysInMonth,
          "border-b": startDate + i + 7 > daysInMonth,
        })}
        key={i}
      >
        <div className="text-gray-300 font-light text-xs">
          {startDate + i - startDay}
        </div>
        {renderCell(startDate + i - startDay)}
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
      renderCell={renderCell}
      key={0}
    />,
  ];
  for (let i = 8 - startsOnDay; i <= daysInMonth; i += 7) {
    weeks.push(
      <Week
        startDate={i}
        startDay={0}
        daysInMonth={daysInMonth}
        renderCell={renderCell}
        key={i}
      />
    );
  }
  return <div>{weeks}</div>;
}

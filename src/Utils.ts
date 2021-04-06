import { addDays, differenceInYears } from "date-fns";

export function getBirthdayAge(
  birthYear: number,
  birthMonth: number,
  birthDate: number
): number {
  return (
    differenceInYears(
      addDays(new Date(), -1),
      new Date(birthYear, birthMonth - 1, birthDate)
    ) + 1
  );
}

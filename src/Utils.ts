import { differenceInYears } from "date-fns";

export function getBirthdayAge(
  birthYear: number,
  birthMonth: number,
  birthDate: number
): number {
  return (
    Math.ceil(
      differenceInYears(
        new Date(),
        new Date(birthYear, birthMonth - 1, birthDate)
      )
    ) + 1
  );
}

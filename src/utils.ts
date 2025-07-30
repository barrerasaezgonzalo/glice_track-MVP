import { monthNames } from "./contants";

export const currentMonthYear = new Date()
  .toLocaleDateString("es-CL", { month: "long", year: "numeric" })
  .replace(" de ", " ")
  .replace(/^./, (c) => c.toUpperCase());

export function generateMonths(
  startYear: any,
  startMonth: any,
  endYear: number,
  endMonth: number,
) {
  const months = [];
  let year = startYear;
  let month = startMonth; // 0-based (0 = Enero)

  while (year < endYear || (year === endYear && month <= endMonth)) {
    const label = `${monthNames[month]} ${year}`;
    months.push(label);
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }

  return months;
}

export function formatDateTime(input: string | number | Date) {
  const date = new Date(input);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export const parseMonthYearString = (monthYearString: string): { month: number; year: number } | null => {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const [monthName, yearStr] = monthYearString.split(' ');
    const monthIndex = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());

    if (monthIndex === -1 || isNaN(parseInt(yearStr))) return null;

    return {
        month: monthIndex,
        year: parseInt(yearStr)
    };
};
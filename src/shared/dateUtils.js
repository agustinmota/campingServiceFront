function parseDate(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return value instanceof Date ? new Date(value) : new Date(value);
}

export function getDateKey(value) {
  if (!value) {
    return "";
  }

  const date = parseDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeDate(value) {
  const date = parseDate(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function formatDate(value, locale = undefined, options = undefined) {
  if (!value) {
    return "";
  }

  return parseDate(value).toLocaleDateString(locale, options);
}

export function isSameDay(firstDate, secondDate) {
  return getDateKey(firstDate) === getDateKey(secondDate);
}

export function isSameMonth(date, monthStart) {
  return date.getFullYear() === monthStart.getFullYear() && date.getMonth() === monthStart.getMonth();
}

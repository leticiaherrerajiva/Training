/** Format an ISO date (YYYY-MM-DD) for display, e.g. "Jul 24". */
export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Today's date as YYYY-MM-DD in the local timezone. */
function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** True when an open todo's due date has passed (today is not overdue). */
export function isOverdue(dueDate: string | undefined): boolean {
  if (!dueDate) return false;
  return dueDate < todayIsoDate();
}

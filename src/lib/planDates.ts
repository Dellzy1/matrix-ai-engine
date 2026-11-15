// Date helpers for Create Action Plan.
// Dates are handled as "YYYY-MM-DD" text, using the user's own local calendar,
// so "today" is correct wherever the user is.

export type DueState = "overdue" | "today" | "tomorrow" | "upcoming" | null;

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const todayKey = () => dateKey(new Date());

export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, days: number): string {
  const d = parseKey(key);
  d.setDate(d.getDate() + days);
  return dateKey(d);
}

// The Monday of the week containing this date.
export function weekStart(key: string): string {
  const d = parseKey(key);
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  return dateKey(d);
}

export function weekDays(startKey: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(startKey, i));
}

// A timestamp (such as completed_at) converted to the user's local date.
export function localDateOf(iso: string | null): string | null {
  if (!iso) return null;
  return dateKey(new Date(iso));
}

// Labels for the reminders. Completed tasks never get one.
export function dueState(due: string | null, status: string, today: string): DueState {
  if (!due || status === "completed") return null;
  if (due < today) return "overdue";
  if (due === today) return "today";
  if (due === addDays(today, 1)) return "tomorrow";
  if (due <= addDays(today, 7)) return "upcoming";
  return null;
}

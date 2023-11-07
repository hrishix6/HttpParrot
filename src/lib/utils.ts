import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export * from "./text.utils";
export * from "./request.utils";
export { getContentTypeHeader } from "./header.utils";
export * from "./url.utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeSince(date: number) {
  const now = new Date();
  const elapsedMilliseconds = now.getTime() - date;

  // Define time intervals in milliseconds
  const second = 1000;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30.44 * day;
  const year = 365.25 * day;

  if (elapsedMilliseconds < second) {
    return 'just now';
  }
  if (elapsedMilliseconds < minute) {
    const seconds = Math.floor(elapsedMilliseconds / 1000);
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  } else if (elapsedMilliseconds < hour) {
    const minutes = Math.floor(elapsedMilliseconds / minute);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (elapsedMilliseconds < day) {
    const hours = Math.floor(elapsedMilliseconds / hour);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (elapsedMilliseconds < week) {
    const days = Math.floor(elapsedMilliseconds / day);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (elapsedMilliseconds < month) {
    const weeks = Math.floor(elapsedMilliseconds / week);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  } else if (elapsedMilliseconds < year) {
    const months = Math.floor(elapsedMilliseconds / month);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(elapsedMilliseconds / year);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          resolve(true);
        })
        .catch((_) => {
          reject(false);
        });
    }
  });
}

export function deepCpObj<T>(obj: any): T {
  if (structuredClone && typeof structuredClone === "function") {
    return structuredClone(obj) as T;
  }
  return JSON.parse(JSON.stringify(obj)) as T;
}
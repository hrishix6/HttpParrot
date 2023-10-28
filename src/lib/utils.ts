import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ContentType, Token } from "@/common/types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
    return "just now";
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

const options = {
  "indent_size": 4,
  "html": {
    "end_with_newline": true,
    "js": {
      "indent_size": 2
    },
    "css": {
      "indent_size": 2
    }
  },
  "css": {
    "indent_size": 1
  },
  "js": {
    "preserve-newlines": true
  }
};

export async function formatCode(str: string, kind: ContentType): Promise<string> {
  switch (kind) {
    case "css":
      return css_beautify(str, options);
    case "json":
    case "js":
      return js_beautify(str, options);
    case "html":
      return html_beautify(str, options);
    default:
      return str;
  }
}

export function determineBodytype(contenTypeHeader: string): [string, ContentType] {

  const parts = contenTypeHeader.split(';').map(part => part.trim());

  const media = parts[0];

  const resContentMap: Record<string, ContentType> = {
    "text/plain": "text",
    "text/html": "html",
    "text/csv": "text",
    "application/xml": "xml",
    "application/javascript": "js",
    "application/pdf": "pdf",
    "application/json": "json",
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/gif": "gif",
    "audio/mpeg": "mpeg",
    "audio/wav": "wav",
    "video/mp4": "mp4",
    "video/ogg": "ogg",
    "application/zip": "zip",
  };

  if (resContentMap[media]) {
    return [media, resContentMap[media]];
  }

  return ["application/octet-stream", "unknown"];

}

function concatChunks(arrays: Uint8Array[]): [number, Uint8Array] {
  let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

  let result = new Uint8Array(totalLength);

  if (!arrays.length) return [totalLength, result];


  // for each array - copy it over result
  // next array is copied right after the previous one
  let length = 0;
  for (let array of arrays) {
    result.set(array, length);
    length += array.length;
  }

  return [length, result];
}

export function readBody(body: ReadableStream<Uint8Array> | null): Promise<[number, Uint8Array]> {
  return new Promise((resolve, reject) => {
    let responseSize = 0;
    let responseBody: Uint8Array[] = [];

    if (body) {
      const reader = body.getReader();

      reader.read().then(function processText({ done, value }): any {
        if (done) {
          console.log(`done reading body`);
          const result = concatChunks(responseBody);
          resolve(result);
          return;
        }

        if (value) {
          responseSize += value.length;
          responseBody.push(value);
        }

        return reader.read().then(processText);
      });
    }
    else {
      reject(new Error("body is null"));
    }

  });

}

export function splitTokens(input: string) {
  const parts = input.split(/({{.*?}})/);
  return parts.filter(part => part.trim() !== "");
}

export function getTokens(arr: string[]): Token[] {
  return arr.map(str => {
    return {
      highlight: str.startsWith("{{") && str.endsWith("}}"),
      text: str
    }
  });
}
export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | { [key: string]: boolean | undefined | null };

function toVal(mix: ClassValue): string {
  let str = '';
  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix;
  } else if (typeof mix === 'object' && mix !== null) {
    if (Array.isArray(mix)) {
      for (let k = 0; k < mix.length; k++) {
        if (mix[k]) {
          const y = toVal(mix[k]);
          if (y) {
            if (str) str += ' ';
            str += y;
          }
        }
      }
    } else {
      for (const k in mix) {
        if (mix[k]) {
          if (str) str += ' ';
          str += k;
        }
      }
    }
  }
  return str;
}

/**
 * shadcn/ui `cn()` utility for conditionally joining and merging classNames.
 */
export function cn(...inputs: ClassValue[]): string {
  return toVal(inputs);
}

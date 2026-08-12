export interface FormatOptions {
  /** Use compact format ("2h 30m") vs long ("2 hours, 30 minutes") */
  long?: boolean;
}

const DURATION_UNITS = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
};

const LONG_UNITS = {
  millisecond: 1,
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
};

/**
 * Parse human-readable duration to milliseconds.
 * Supports: "2h30m", "1.5 days", "90s", "1w2d", "PT2H30M" (ISO 8601)
 */
export function parse(input: string): number {
  const trimmed = input.trim();

  // ISO 8601 format: P...
  if (trimmed.startsWith("P") || trimmed.startsWith("p")) {
    return parseISO8601(trimmed);
  }

  let total = 0;
  let pattern = /(\d+(?:\.\d+)?)\s*([a-z]+)/gi;
  let match;
  let foundMatch = false;

  while ((match = pattern.exec(trimmed)) !== null) {
    foundMatch = true;
    const num = parseFloat(match[1]);
    let unit = match[2].toLowerCase();

    // Map common full forms to short forms
    const unitMap: Record<string, keyof typeof DURATION_UNITS> = {
      milliseconds: "ms",
      millisecond: "ms",
      seconds: "s",
      second: "s",
      minutes: "m",
      minute: "m",
      hours: "h",
      hour: "h",
      days: "d",
      day: "d",
      weeks: "w",
      week: "w",
    };

    if (unit in unitMap) {
      unit = unitMap[unit];
    }

    if (unit in DURATION_UNITS) {
      total += num * DURATION_UNITS[unit as keyof typeof DURATION_UNITS];
    } else {
      throw new Error(`Unknown duration unit: ${unit}`);
    }
  }

  if (!foundMatch) {
    throw new Error(`Invalid duration format: ${input}`);
  }

  return Math.round(total);
}

/**
 * Parse ISO 8601 duration (e.g., "PT2H30M", "P1DT2H")
 */
function parseISO8601(iso: string): number {
  const pattern =
    /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?)?/i;
  const match = iso.match(pattern);

  if (!match) {
    throw new Error(`Invalid ISO 8601 duration: ${iso}`);
  }

  let total = 0;
  if (match[1]) total += parseInt(match[1], 10) * DURATION_UNITS.d;
  if (match[2]) total += parseInt(match[2], 10) * DURATION_UNITS.h;
  if (match[3]) total += parseInt(match[3], 10) * DURATION_UNITS.m;
  if (match[4]) total += parseFloat(match[4]) * DURATION_UNITS.s;

  return Math.round(total);
}

/**
 * Format milliseconds back to human-readable duration
 */
export function format(ms: number, opts: FormatOptions = {}): string {
  const isLong = opts.long ?? false;

  if (ms < 1000) {
    return isLong ? `${ms} milliseconds` : `${ms}ms`;
  }

  const units = isLong
    ? [
        { name: "week", short: "w", ms: LONG_UNITS.week },
        { name: "day", short: "d", ms: LONG_UNITS.day },
        { name: "hour", short: "h", ms: LONG_UNITS.hour },
        { name: "minute", short: "m", ms: LONG_UNITS.minute },
        { name: "second", short: "s", ms: LONG_UNITS.second },
      ]
    : [
        { name: "w", short: "w", ms: DURATION_UNITS.w },
        { name: "d", short: "d", ms: DURATION_UNITS.d },
        { name: "h", short: "h", ms: DURATION_UNITS.h },
        { name: "m", short: "m", ms: DURATION_UNITS.m },
        { name: "s", short: "s", ms: DURATION_UNITS.s },
      ];

  let remaining = ms;
  const parts: string[] = [];

  for (const unit of units) {
    if (remaining >= unit.ms) {
      const count = Math.floor(remaining / unit.ms);
      remaining = remaining % unit.ms;

      if (isLong) {
        parts.push(`${count} ${unit.name}${count > 1 ? "s" : ""}`);
      } else {
        parts.push(`${count}${unit.short}`);
      }
    }
  }

  return isLong ? parts.join(", ") : parts.join(" ");
}

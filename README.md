# duration-parser

Parse human-readable durations to milliseconds and format back; ISO 8601 support.

## Quick Start

```typescript
import { parse, format } from "duration-parser";

const ms = parse("2h30m");           // 9000000
const ms2 = parse("1.5 days");       // 129600000
const ms3 = parse("PT2H30M");        // 9000000 (ISO 8601)

format(ms);                           // "2h 30m"
format(ms, { long: true });          // "2 hours, 30 minutes"
```

## API

### `parse(input: string): number`

Parse human-readable duration to milliseconds. Supports:

- **Compact format:** "2h30m", "90s", "1w2d"
- **Long format:** "1.5 days", "2 hours 30 minutes"
- **ISO 8601:** "PT2H30M", "P1DT3H45M30S"
- **Plural/singular:** "1 second", "2 seconds"

**Throws** `Error` on invalid format.

### `format(ms: number, opts?: FormatOptions): string`

Format milliseconds back to human-readable duration.

**Options:**
- `long?: boolean` — Use long format ("2 hours") instead of compact ("2h")

## Limitations

- Rounds intermediate calculations to whole milliseconds
- No locale-specific translations
- Week/month/year approximations: assumes 7d = 1w, no month/year (use libraries like `date-fns` for calendar math)

---

Part of the [ferrow-toolkit](https://github.com/Ruzylo-cloud/ferrow-toolkit) collection · Sponsored by [Ferrow](https://ferrow.ai)

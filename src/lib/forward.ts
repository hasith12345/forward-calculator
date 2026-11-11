export interface ForwardInput {
  F: number // agreed forward price
  n: number // quantity
  ST: number // market (spot) price at maturity
}

export type Status = 'gain' | 'loss' | 'even'

export interface ForwardResult {
  longPL: number
  shortPL: number
  notional: number
  settlementValue: number
  priceMovePct: number
  longReturnPct: number
  zeroSum: number
  longStatus: Status
  shortStatus: Status
}

export function status(x: number): Status {
  if (Math.abs(x) < 1e-9) return 'even'
  return x > 0 ? 'gain' : 'loss'
}

/** Payoffs per course notes: Long = (ST - F) * n, Short = (F - ST) * n */
export function calcForward({ F, n, ST }: ForwardInput): ForwardResult {
  const longPL = (ST - F) * n
  const shortPL = (F - ST) * n
  const notional = F * n
  return {
    longPL,
    shortPL,
    notional,
    settlementValue: ST * n,
    priceMovePct: F ? ((ST - F) / F) * 100 : 0,
    longReturnPct: notional ? (longPL / notional) * 100 : 0,
    zeroSum: longPL + shortPL,
    longStatus: status(longPL),
    shortStatus: status(shortPL),
  }
}

export interface RawInput {
  F: string
  n: string
  ST: string
}

export type Errors = Partial<Record<keyof RawInput, string>>

export function validate(raw: RawInput): { values: ForwardInput | null; errors: Errors } {
  const errors: Errors = {}
  const parse = (s: string) => (s.trim() === '' ? NaN : Number(s))
  const F = parse(raw.F)
  const n = parse(raw.n)
  const ST = parse(raw.ST)
  if (!Number.isFinite(F)) errors.F = 'Enter a number'
  else if (F <= 0) errors.F = 'Must be greater than 0'
  if (!Number.isFinite(n)) errors.n = 'Enter a number'
  else if (n <= 0) errors.n = 'Must be greater than 0'
  if (!Number.isFinite(ST)) errors.ST = 'Enter a number'
  else if (ST < 0) errors.ST = 'Cannot be negative'
  if (Object.keys(errors).length) return { values: null, errors }
  return { values: { F, n, ST }, errors }
}

// ---------- Extras (Hull, Options, Futures & Other Derivatives, ch. 5) ----------

/** Cost-of-carry fair forward price: F0 = S0 * e^{(r + u - y) T}. Rates as decimals. */
export function fairForwardPrice(S0: number, r: number, T: number, u = 0, y = 0): number {
  return S0 * Math.exp((r + u - y) * T)
}

/** Currency forward via interest-rate parity: F0 = S0 * e^{(rd - rf) T}. */
export function currencyForwardPrice(S0: number, rd: number, rf: number, T: number): number {
  return S0 * Math.exp((rd - rf) * T)
}

/** Value today of a long forward struck at F when current fair forward is F0 (time T left). */
export function longForwardValue(F0: number, F: number, r: number, T: number, n = 1): number {
  return (F0 - F) * Math.exp(-r * T) * n
}

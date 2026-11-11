import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cn = (...i: ClassValue[]) => twMerge(clsx(i))

export const fmtMoney = (x: number, cur = '$', digits = 2) => {
  const s = Math.abs(x).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
  return `${x < 0 ? '−' : x > 0 ? '+' : ''}${cur}${s}`
}
export const fmtPlain = (x: number, cur = '$', digits = 2) =>
  `${cur}${x.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
export const fmtPct = (x: number) => `${x > 0 ? '+' : x < 0 ? '−' : ''}${Math.abs(x).toFixed(2)}%`

import { calcForward } from '../lib/forward'
import { cn, fmtMoney, fmtPlain } from '../lib/utils'

const chip = (x: number) => cn('num inline-block min-w-[5.5rem] rounded-ctl px-2.5 py-1 text-right font-semibold', x > 0 && 'bg-gain-tint text-gain', x < 0 && 'bg-loss-tint text-loss', x === 0 && 'bg-muted text-sub')

export function ScenarioTable({ F, n, cur, digits }: { F: number; n: number; cur: string; digits: number }) {
  const rows = [-20, -10, 0, 10, 20].map((p) => { const ST = F * (1 + p / 100); return { p, ST, ...calcForward({ F, n, ST }) } })
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-base">
        <thead><tr className="text-left text-sm text-sub"><th className="pb-2 font-semibold">Move</th><th className="pb-2 font-semibold">S_T</th><th className="pb-2 text-right font-semibold">Buyer</th><th className="pb-2 text-right font-semibold">Seller</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.p} className={cn('border-t-[length:var(--bw)] border-line', r.p === 0 && 'bg-brand-soft')}>
              <td className="num rounded-l-lg py-2.5 pl-2 font-semibold">{r.p > 0 ? '+' : r.p < 0 ? '−' : ''}{Math.abs(r.p)}%</td>
              <td className="num">{fmtPlain(r.ST, cur, digits)}</td>
              <td className="text-right"><span className={chip(r.longPL)}>{fmtMoney(r.longPL, cur, 0)}</span></td>
              <td className="rounded-r-lg py-2.5 pr-2 text-right"><span className={chip(r.shortPL)}>{fmtMoney(r.shortPL, cur, 0)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-sm text-sub">Each row nets to {cur}0. One side's gain is the other's loss.</p>
    </div>
  )
}

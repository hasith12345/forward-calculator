import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type { ForwardInput, Status } from '../lib/forward'
import { cn, fmtMoney, fmtPct, fmtPlain } from '../lib/utils'
import { AnimatedNumber } from './AnimatedNumber'
import { Card } from './ui'

interface Props { side: 'long' | 'short'; pl: number; status: Status; v: ForwardInput; cur: string; digits: number; unit: string }

export function PayoffCard({ side, pl, status, v, cur, digits, unit }: Props) {
  const long = side === 'long'
  const F = fmtPlain(v.F, cur, digits), S = fmtPlain(v.ST, cur, digits)
  const expl = status === 'even' ? 'The market price equals the agreed price. Nothing is gained or lost.'
    : long
      ? v.ST > v.F ? `Pays only ${F} for something now worth ${S}.` : `Must still pay ${F} for something now worth only ${S}.`
      : v.ST < v.F ? `Sells at ${F} while the market is only ${S}.` : `Locked in at ${F} and misses out on the market's ${S}.`
  const tone = status === 'gain' ? 'text-gain' : status === 'loss' ? 'text-loss' : 'text-sub'
  const band = status === 'gain' ? 'bg-gain-tint' : status === 'loss' ? 'bg-loss-tint' : 'bg-muted'
  const pill = status === 'gain' ? 'bg-gain text-onsolid' : status === 'loss' ? 'bg-loss text-onsolid' : 'bg-sub text-onsolid'
  const Icon = status === 'gain' ? ArrowUpRight : status === 'loss' ? ArrowDownRight : Minus
  return (
    <Card className="overflow-hidden">
      <div className={cn('px-6 pb-5 pt-5 transition-colors', band)}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">{long ? 'Buyer (Long)' : 'Seller (Short)'}</div>
            <div className="text-sm text-sub">{long ? 'Bullish: agreed to buy at F' : 'Bearish: agreed to sell at F'}</div>
          </div>
          <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold', pill)}>
            <Icon size={16} strokeWidth={2.5} />{status === 'gain' ? 'Profit' : status === 'loss' ? 'Loss' : 'Break-even'}
          </span>
        </div>
        <div className={cn('num mt-4 whitespace-nowrap text-[clamp(2.4rem,4.6vw,3.75rem)] font-bold leading-none tracking-tight', tone)}>
          <AnimatedNumber value={pl} format={(x) => fmtMoney(x, cur, 2)} />
        </div>
        <div className="num mt-2 text-base font-medium text-sub">{fmtPct(v.F && v.n ? (pl / (v.F * v.n)) * 100 : 0)} of contract value</div>
      </div>
      <div className="px-6 pb-6 pt-5">
        <div className="num rounded-ctl bg-muted px-4 py-3 text-[15px] leading-7 text-ink">
          <span className="font-semibold">{long ? '(S_T − F) × n' : '(F − S_T) × n'}</span><br />
          = ({long ? `${v.ST} − ${v.F}` : `${v.F} − ${v.ST}`}) × {v.n.toLocaleString()} {unit}
        </div>
        <p className="mt-3 text-base text-sub">{expl}</p>
      </div>
    </Card>
  )
}

import { useState } from 'react'
import { currencyForwardPrice, fairForwardPrice, longForwardValue } from '../lib/forward'
import { fmtMoney, fmtPlain } from '../lib/utils'
import { Card, CardTitle, Field } from './ui'

const num = (s: string) => (s.trim() === '' ? NaN : Number(s))
const ok = Number.isFinite

const Result = ({ formula, value }: { formula: string; value: string }) => (
  <div className="rounded-ctl bg-brand-soft px-4 py-3">
    <div className="num text-sm text-sub">{formula}</div>
    <div className="num mt-0.5 text-3xl font-bold text-brand">{value}</div>
  </div>
)

export function PricingTab() {
  const [S0, setS0] = useState('100'); const [r, setR] = useState('5'); const [T, setT] = useState('0.5')
  const [u, setU] = useState('0'); const [y, setY] = useState('0'); const [rf, setRf] = useState('2')
  const [Fa, setFa] = useState('101'); const [n, setN] = useState('1000'); const [Tl, setTl] = useState('0.25'); const [S1, setS1] = useState('102')

  const carry = fairForwardPrice(num(S0), num(r) / 100, num(T), num(u) / 100, num(y) / 100)
  const fx = currencyForwardPrice(num(S0), num(r) / 100, num(rf) / 100, num(T))
  const F0 = fairForwardPrice(num(S1), num(r) / 100, num(Tl))
  const val = longForwardValue(F0, num(Fa), num(r) / 100, num(Tl), num(n))
  const e = (set: (s: string) => void) => (ev: React.ChangeEvent<HTMLInputElement>) => set(ev.target.value)
  const d = { inputMode: 'decimal' as const }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <CardTitle title="Where does the agreed price come from?" sub="No-arbitrage pricing: today's spot price grown at the cost of carry." />
        <div className="mt-5 grid grid-cols-2 gap-4">
          <Field label="Spot price S₀" value={S0} onChange={e(setS0)} {...d} />
          <Field label="Maturity T" suffix="years" value={T} onChange={e(setT)} {...d} />
          <Field label="Risk-free rate r" suffix="%" value={r} onChange={e(setR)} {...d} />
          <Field label="Storage cost u" suffix="%" value={u} onChange={e(setU)} {...d} />
          <Field label="Yield y" suffix="%" value={y} onChange={e(setY)} {...d} />
          <Field label="Foreign rate r_f" suffix="%" value={rf} onChange={e(setRf)} {...d} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Result formula="F₀ = S₀·e^((r+u−y)T)" value={ok(carry) ? fmtPlain(carry, '', 4) : '—'} />
          <Result formula="Currency: S₀·e^((r−r_f)T)" value={ok(fx) ? fmtPlain(fx, '', 4) : '—'} />
        </div>
      </Card>
      <Card className="p-6">
        <CardTitle title="Value of a long forward before maturity" sub="Starts at zero, then moves with spot. Uses r from the left card." />
        <div className="mt-5 grid grid-cols-2 gap-4">
          <Field label="Agreed price F" value={Fa} onChange={e(setFa)} {...d} />
          <Field label="Quantity n" value={n} onChange={e(setN)} {...d} />
          <Field label="Current spot S" value={S1} onChange={e(setS1)} {...d} />
          <Field label="Time left" suffix="years" value={Tl} onChange={e(setTl)} {...d} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Result formula="f = (F₀ − F)·e^(−rT)·n" value={ok(val) ? fmtMoney(val, '') : '—'} />
          <Result formula="Current fair forward F₀" value={ok(F0) ? fmtPlain(F0, '', 4) : '—'} />
        </div>
        <p className="mt-4 text-sm text-sub">Source: Hull, Options, Futures and Other Derivatives, ch. 5. Extra material beyond the assignment brief.</p>
      </Card>
    </div>
  )
}

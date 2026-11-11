import { Scale } from 'lucide-react'
import { useMemo, useState } from 'react'
import { NotesTab } from './components/NotesTab'
import { PayoffCard } from './components/PayoffCard'
import { PayoffChart } from './components/PayoffChart'
import { PricingTab } from './components/PricingTab'
import { ScenarioTable } from './components/ScenarioTable'
import { Card, CardTitle, Field, Pill, Slider, Stat } from './components/ui'
import { calcForward, validate } from './lib/forward'
import { presets, type Preset } from './lib/presets'
import { cn, fmtPlain } from './lib/utils'

const currencies = ['$', '€', '£', 'Rs ', '¥', 'CHF ', 'C$']
type Tab = 'calc' | 'pricing' | 'notes'
const tabs: [Tab, string][] = [['calc', 'Calculator'], ['pricing', 'Pricing'], ['notes', 'Notes']]

export default function App() {
  const [tab, setTab] = useState<Tab>('calc')
  const [preset, setPreset] = useState<Preset>(presets[0])
  const [raw, setRaw] = useState({ F: presets[0].F, n: presets[0].n, ST: presets[0].ST })
  const [cur, setCur] = useState('$')
  const [unit, setUnit] = useState(presets[0].unit)
  const [digits, setDigits] = useState(presets[0].digits)

  const { values, errors } = useMemo(() => validate(raw), [raw])
  const result = useMemo(() => (values ? calcForward(values) : null), [values])
  const set = (k: 'F' | 'n' | 'ST') => (e: React.ChangeEvent<HTMLInputElement>) => setRaw({ ...raw, [k]: e.target.value })
  const apply = (p: Preset) => { setPreset(p); setRaw({ F: p.F, n: p.n, ST: p.ST }); setUnit(p.unit); setCur(p.cur); setDigits(p.digits) }

  const lo = values ? values.F * 0.5 : 0
  const hi = values ? values.F * 1.5 : 1
  const step = values ? values.F / 1000 : 0.01
  const cs = cur.trim()
  const u = unit || 'units'

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-10 border-b-[length:var(--bw)] border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-ctl bg-brand text-onbrand"><Scale size={20} /></div>
            <span className="hidden text-lg font-bold tracking-tight sm:inline">Forward Calculator</span>
          </div>
          <nav className="flex rounded-ctl bg-muted p-1">
            {tabs.map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)} className={cn('cursor-pointer rounded-ctl px-4 py-1.5 text-sm font-semibold transition', tab === k ? 'bg-surface text-brand shadow-sm' : 'text-sub hover:text-ink')}>{label}</button>
            ))}
          </nav>
          <span className="hidden rounded-full border-[length:var(--bw)] border-line bg-brand-soft px-3 py-1 text-sm font-semibold text-brand sm:inline">IS4350 · Group 1</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-5 pb-16 pt-8 sm:px-8">
        {tab === 'calc' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">Forward contract profit &amp; loss</h1>
                <p className="mt-1 text-base text-sub">Fix a price today, settle at maturity. See who wins, who loses, and by how much.</p>
              </div>
              <div className="flex flex-col gap-3">
                {([['commodity', 'Commodities'], ['fx', 'Currency pairs']] as const).map(([g, title]) => (
                  <div key={g} className="flex flex-wrap items-center gap-2">
                    <span className="w-32 text-sm font-semibold text-sub">{title}</span>
                    {presets.filter((p) => p.group === g).map((p) => <Pill key={p.id} active={preset.id === p.id} onClick={() => apply(p)}>{p.label}</Pill>)}
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-6">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_100px_minmax(0,140px)]">
                <Field label={`Agreed price (F), per ${u}`} prefix={cs} value={raw.F} onChange={set('F')} error={errors.F} inputMode="decimal" />
                <Field label="Quantity (n)" suffix={u} value={raw.n} onChange={set('n')} error={errors.n} inputMode="decimal" />
                <Field label="Market price at maturity (S_T)" prefix={cs} value={raw.ST} onChange={set('ST')} error={errors.ST} inputMode="decimal" />
                <label className="block"><span className="mb-1.5 block text-sm font-semibold text-sub">Currency</span>
                  <select value={cur} onChange={(e) => setCur(e.target.value)} className="h-12 w-full cursor-pointer rounded-ctl border-[length:var(--bw)] border-field bg-surface px-3 text-xl font-semibold focus:border-brand focus:ring-4 focus:ring-brand/15">{currencies.map((c) => <option key={c} value={c}>{c.trim()}</option>)}</select></label>
                <label className="block"><span className="mb-1.5 block text-sm font-semibold text-sub">Unit</span>
                  <input value={unit} onChange={(e) => setUnit(e.target.value)} className="h-12 w-full rounded-ctl border-[length:var(--bw)] border-field bg-surface px-3.5 text-lg font-semibold focus:border-brand focus:ring-4 focus:ring-brand/15" /></label>
              </div>
              {values && (
                <div className="mt-6 border-t-[length:var(--bw)] border-line pt-5">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-sub">Drag to move the market price</span>
                    <span className="num text-base font-semibold">S_T = {fmtPlain(values.ST, cur, digits)} <span className={cn('ml-1', values.ST > values.F ? 'text-gain' : values.ST < values.F ? 'text-loss' : 'text-sub')}>({result!.priceMovePct > 0 ? '+' : ''}{result!.priceMovePct.toFixed(1)}% vs F)</span></span>
                  </div>
                  <Slider min={lo} max={hi} step={step} value={[Math.min(hi, Math.max(lo, values.ST))]} onValueChange={([x]) => setRaw({ ...raw, ST: String(Number(x.toFixed(digits))) })} />
                  <div className="num mt-1 flex justify-between text-sm text-sub"><span>{fmtPlain(lo, cur, digits)}</span><span>{fmtPlain(hi, cur, digits)}</span></div>
                </div>
              )}
              <p className="mt-3 text-sm text-sub">{preset.note}</p>
            </Card>

            {result && values ? (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  <PayoffCard side="long" pl={result.longPL} status={result.longStatus} v={values} cur={cur} digits={digits} unit={u} />
                  <PayoffCard side="short" pl={result.shortPL} status={result.shortStatus} v={values} cur={cur} digits={digits} unit={u} />
                </div>
                <Card className="grid grid-cols-2 gap-5 p-6 md:grid-cols-4">
                  <Stat label="Contract value (F × n)" value={fmtPlain(result.notional, cur)} />
                  <Stat label="Worth at maturity (S_T × n)" value={fmtPlain(result.settlementValue, cur)} />
                  <Stat label="Price move" tone={result.priceMovePct > 0 ? 'gain' : result.priceMovePct < 0 ? 'loss' : undefined} value={`${result.priceMovePct > 0 ? '+' : ''}${result.priceMovePct.toFixed(2)}%`} />
                  <Stat label="Buyer + seller (zero-sum)" value={`${fmtPlain(Math.abs(result.zeroSum) < 1e-6 ? 0 : result.zeroSum, cur)} ✓`} />
                </Card>
                <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                  <Card className="p-6"><CardTitle title="Payoff diagram" sub="Profit or loss at every possible market price" /><div className="mt-3"><PayoffChart v={values} cur={cur} digits={digits} lo={lo} hi={hi} /></div></Card>
                  <Card className="p-6"><CardTitle title="What if the market moves?" sub="Relative to the agreed price" /><div className="mt-4"><ScenarioTable F={values.F} n={values.n} cur={cur} digits={digits} /></div></Card>
                </div>
              </>
            ) : (
              <Card className="p-12 text-center text-lg text-sub">Enter valid numbers for F, quantity and S_T to see the settlement.</Card>
            )}
          </div>
        )}
        {tab === 'pricing' && <PricingTab />}
        {tab === 'notes' && <NotesTab />}
      </main>
    </div>
  )
}

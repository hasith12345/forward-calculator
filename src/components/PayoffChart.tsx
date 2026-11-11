import { useId, useRef, useState } from 'react'
import type { ForwardInput } from '../lib/forward'
import { fmtMoney } from '../lib/utils'

const W = 720, H = 400, m = { t: 40, r: 24, b: 48, l: 64 }
const BRAND = 'var(--color-brand)', AMBER = 'var(--color-amber)', INK = 'var(--color-ink)', SUB = 'var(--color-sub)'

function niceStep(range: number, ticks: number) {
  const raw = range / ticks, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p
  return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p
}
const compact = (x: number) => (Math.abs(x) >= 1e6 ? `${+(x / 1e6).toFixed(2)}M` : Math.abs(x) >= 1e3 ? `${+(x / 1e3).toFixed(1)}k` : `${+x.toFixed(2)}`)

export function PayoffChart({ v, cur, digits, lo, hi }: { v: ForwardInput; cur: string; digits: number; lo: number; hi: number }) {
  const id = useId()
  const ref = useRef<SVGSVGElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const yMax = (hi - v.F) * v.n
  const pw = W - m.l - m.r
  const x = (s: number) => m.l + ((s - lo) / (hi - lo)) * pw
  const y = (p: number) => m.t + ((yMax - p) / (2 * yMax)) * (H - m.t - m.b)
  const xs = niceStep(hi - lo, 6), ys = niceStep(2 * yMax, 4)
  const xt: number[] = []; for (let s = Math.ceil(lo / xs) * xs; s <= hi + 1e-9; s += xs) xt.push(s)
  const yt: number[] = []; for (let p = Math.ceil(-yMax / ys) * ys; p <= yMax + 1e-9; p += ys) yt.push(p)
  const cl = (s: number) => Math.min(hi, Math.max(lo, s))
  const s = hover ?? cl(v.ST)
  const lp = (s - v.F) * v.n
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    setHover(cl(lo + ((((e.clientX - r.left) / r.width) * W - m.l) / pw) * (hi - lo)))
  }
  const area = `M${x(lo)},${y(-yMax)} L${x(hi)},${y(yMax)} L${x(hi)},${y(0)} L${x(lo)},${y(0)} Z`
  const tipW = 210, tipX = m.l + pw / 2 - tipW / 2

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img" aria-label="Payoff diagram">
      <defs>
        <clipPath id={id + 'u'}><rect x={m.l} y={m.t} width={pw} height={y(0) - m.t} /></clipPath>
        <clipPath id={id + 'd'}><rect x={m.l} y={y(0)} width={pw} height={H - m.b - y(0)} /></clipPath>
      </defs>
      {yt.map((p) => <line key={p} x1={m.l} x2={W - m.r} y1={y(p)} y2={y(p)} stroke="var(--color-line)" strokeOpacity=".7" />)}
      {yt.map((p) => <text key={'t' + p} x={m.l - 10} y={y(p) + 5} textAnchor="end" fontSize="14" fill={SUB} className="num">{compact(p)}</text>)}
      {xt.map((t) => <text key={'x' + t} x={x(t)} y={H - m.b + 22} textAnchor="middle" fontSize="14" fill={SUB} className="num">{+t.toFixed(digits)}</text>)}
      <text x={m.l + pw / 2} y={H - 6} textAnchor="middle" fontSize="14" fontWeight="600" fill={SUB}>Market price at maturity (S_T)</text>
      <text x={m.l} y={14} fontSize="14" fontWeight="600" fill={SUB}>Profit / loss ({cur.trim()})</text>
      {/* buyer area: green above 0, red below */}
      <path d={area} fill="var(--color-gain)" fillOpacity=".16" clipPath={`url(#${id}u)`} />
      <path d={area} fill="var(--color-loss)" fillOpacity=".14" clipPath={`url(#${id}d)`} />
      <line x1={m.l} x2={W - m.r} y1={y(0)} y2={y(0)} stroke={INK} strokeWidth="1.5" />
      {/* F marker */}
      <line x1={x(v.F)} x2={x(v.F)} y1={m.t} y2={H - m.b} stroke={SUB} strokeDasharray="5 5" />
      <g transform={`translate(${x(v.F)},${m.t - 30})`}>
        <rect x="-44" y="0" width="88" height="24" rx="12" fill={INK} />
        <text y="17" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--color-page)" className="num">F = {v.F}</text>
      </g>
      {/* lines */}
      <line x1={x(lo)} y1={y(-yMax)} x2={x(hi)} y2={y(yMax)} stroke={BRAND} strokeWidth="4" strokeLinecap="round" />
      <line x1={x(lo)} y1={y(yMax)} x2={x(hi)} y2={y(-yMax)} stroke={AMBER} strokeWidth="4" strokeLinecap="round" />
      {/* legend */}
      <g fontSize="14" fontWeight="600">
        <circle cx={W - m.r - 150} cy={18} r="5" fill={BRAND} /><text x={W - m.r - 140} y={23} fill={INK}>Buyer</text>
        <circle cx={W - m.r - 80} cy={18} r="5" fill={AMBER} /><text x={W - m.r - 70} y={23} fill={INK}>Seller</text>
      </g>
      {/* marker */}
      <line x1={x(s)} x2={x(s)} y1={m.t} y2={H - m.b} stroke={INK} strokeOpacity=".25" />
      <circle cx={x(s)} cy={y(lp)} r="8" fill={BRAND} stroke="var(--color-surface)" strokeWidth="3" />
      <circle cx={x(s)} cy={y(-lp)} r="8" fill={AMBER} stroke="var(--color-surface)" strokeWidth="3" />
      {/* tooltip, pinned to the empty top-centre */}
      <g transform={`translate(${tipX},${m.t + 6})`}>
        <rect width={tipW} height="74" rx="12" fill="var(--color-surface)" stroke="var(--color-field)" filter="drop-shadow(0 4px 10px rgba(15,23,42,.12))" />
        <text x="14" y="23" fontSize="14" fontWeight="700" fill={INK} className="num">S_T = {cur}{s.toFixed(digits)}</text>
        <text x="14" y="45" fontSize="14" fill={BRAND} fontWeight="600" className="num">Buyer {fmtMoney(lp, cur, 0)}</text>
        <text x="14" y="65" fontSize="14" fill={AMBER} fontWeight="600" className="num">Seller {fmtMoney(-lp, cur, 0)}</text>
      </g>
    </svg>
  )
}

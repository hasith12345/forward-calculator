import { Card, CardTitle } from './ui'

const rows = [
  ['Traded', 'Over the counter', 'On an exchange'],
  ['Terms', 'Customised', 'Standardised'],
  ['Liquidity', 'Lower', 'Higher'],
  ['Margin', 'None required', 'Daily, marked to market'],
  ['Default risk', 'Higher (counterparty)', 'Lower (clearing house)'],
  ['Settlement', 'Once, at maturity', 'Every day'],
]

export function NotesTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <CardTitle title="What is a forward contract?" />
        <div className="mt-4 space-y-3 text-base leading-relaxed text-sub">
          <p>An agreement to buy or sell an asset at a set future date for a price fixed <b className="text-ink">today</b>. It is traded over the counter, nothing is paid up front, and the whole gain or loss is realised at maturity.</p>
          <ul className="space-y-2">
            <li className="rounded-ctl bg-gain-tint px-4 py-3"><b className="text-ink">Long (buyer)</b> expects prices to rise and earns <span className="num font-semibold text-gain">S_T − F</span></li>
            <li className="rounded-ctl bg-loss-tint px-4 py-3"><b className="text-ink">Short (seller)</b> expects prices to fall and earns <span className="num font-semibold text-loss">F − S_T</span></li>
          </ul>
          <p>It is zero-sum: whatever one side gains, the other loses.</p>
          <p><b className="text-ink">Hedgers</b> fix a price to remove risk, like an airline locking in fuel. <b className="text-ink">Speculators</b> bet on direction.</p>
          <p className="rounded-ctl border border-amber bg-amber/10 px-4 py-3 text-sm text-ink">Educational model: ignores transaction costs, interest, margin and counterparty default.</p>
        </div>
      </Card>
      <Card className="p-6">
        <CardTitle title="Forwards vs futures" />
        <table className="mt-4 w-full text-base">
          <thead><tr className="bg-muted text-left text-sm text-sub"><th className="rounded-l-lg px-3 py-2 font-semibold"></th><th className="px-3 py-2 font-semibold">Forward</th><th className="rounded-r-lg px-3 py-2 font-semibold">Futures</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r[0]} className="border-b-[length:var(--bw)] border-line last:border-0"><td className="px-3 py-3 font-semibold">{r[0]}</td><td className="px-3 py-3 text-sub">{r[1]}</td><td className="px-3 py-3 text-sub">{r[2]}</td></tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  )
}

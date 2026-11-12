import { Card, CardTitle } from './ui'

const symbols = [
  ['F', 'Forward (agreed) price', 'The price fixed today for the future trade. Also called the delivery price.'],
  ['S_T', 'Spot price at maturity', 'The actual market price on the settlement date (T). Unknown until then.'],
  ['n', 'Quantity', 'How many units the contract covers, e.g. bushels, ounces or currency units.'],
  ['T', 'Maturity', 'The date the contract settles.'],
  ['S_T − F', 'Buyer (long) payoff', 'Per unit. Multiply by n for the total profit or loss.'],
  ['F − S_T', 'Seller (short) payoff', 'The mirror image of the buyer, so the two always sum to zero.'],
  ['F × n', 'Contract value', 'What the buyer agrees to pay in total for n units.'],
  ['S_T × n', 'Worth at maturity', 'What those n units are actually worth in the market on the day.'],
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
        </div>
      </Card>
      <Card className="p-6">
        <CardTitle title="What do the symbols mean?" sub="The shorthand used on the calculator" />
        <dl className="mt-4 space-y-2">
          {symbols.map(([sym, name, desc]) => (
            <div key={sym} className="flex gap-3 rounded-ctl bg-muted px-3 py-2">
              <dt className="num w-16 shrink-0 text-base font-semibold text-brand">{sym}</dt>
              <dd className="text-sm text-sub"><b className="text-ink">{name}.</b> {desc}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  )
}

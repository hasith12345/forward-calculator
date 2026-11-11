export interface Preset {
  id: string
  label: string
  group: 'commodity' | 'fx'
  asset: string
  unit: string // what is being bought (commodity unit, or base currency for FX)
  cur: string // price currency symbol (quote currency for FX)
  F: string
  n: string
  ST: string
  digits: number
  note: string
}

export const presets: Preset[] = [
  { id: 'wheat', label: 'Wheat', group: 'commodity', asset: 'Wheat', unit: 'bushel', cur: '$', F: '6.50', n: '50000', ST: '7.40', digits: 2,
    note: 'A bakery agrees to buy 50,000 bushels of wheat in 6 months at $6.50.' },
  { id: 'gold', label: 'Gold', group: 'commodity', asset: 'Gold', unit: 'oz', cur: '$', F: '1500', n: '200', ST: '1475', digits: 2,
    note: 'Gold forward: 200 oz at $1,500 (from the Gold futures example in the slides).' },
  { id: 'oil', label: 'Crude oil', group: 'commodity', asset: 'Crude oil', unit: 'barrel', cur: '$', F: '80', n: '10000', ST: '72', digits: 2,
    note: 'An airline hedges fuel by buying 10,000 barrels forward at $80.' },

  // Currency pairs: price is quoted as (quote currency) per 1 (base currency). Rates are illustrative.
  { id: 'eurusd', label: 'EUR/USD', group: 'fx', asset: 'EUR', unit: 'EUR', cur: '$', F: '1.0850', n: '100000', ST: '1.1020', digits: 4,
    note: 'Buy EUR 100,000 forward at $1.0850 per euro. Euro strengthens to 1.1020.' },
  { id: 'gbpusd', label: 'GBP/USD', group: 'fx', asset: 'GBP', unit: 'GBP', cur: '$', F: '1.5410', n: '250000', ST: '1.6000', digits: 4,
    note: 'Slide example: buy GBP 250,000 at USD 1.5410/GBP; rate rises to 1.6000, so the buyer gains $14,750.' },
  { id: 'usdjpy', label: 'USD/JPY', group: 'fx', asset: 'USD', unit: 'USD', cur: '¥', F: '150.00', n: '100000', ST: '146.50', digits: 2,
    note: 'Buy USD 100,000 forward at ¥150.00. The dollar weakens to ¥146.50, so the buyer loses.' },
  { id: 'usdlkr', label: 'USD/LKR', group: 'fx', asset: 'USD', unit: 'USD', cur: 'Rs ', F: '305', n: '50000', ST: '312', digits: 2,
    note: 'An importer buys USD 50,000 forward at Rs 305 to lock in the rate. The rupee weakens to Rs 312.' },
  { id: 'audusd', label: 'AUD/USD', group: 'fx', asset: 'AUD', unit: 'AUD', cur: '$', F: '0.6600', n: '100000', ST: '0.6480', digits: 4,
    note: 'Buy AUD 100,000 forward at $0.6600. The Australian dollar falls to 0.6480.' },
  { id: 'usdchf', label: 'USD/CHF', group: 'fx', asset: 'USD', unit: 'USD', cur: 'CHF ', F: '0.8800', n: '100000', ST: '0.8650', digits: 4,
    note: 'Buy USD 100,000 forward at CHF 0.8800. The dollar slips to CHF 0.8650.' },
  { id: 'usdcad', label: 'USD/CAD', group: 'fx', asset: 'USD', unit: 'USD', cur: 'C$', F: '1.3600', n: '100000', ST: '1.3750', digits: 4,
    note: 'Buy USD 100,000 forward at C$1.3600. The dollar rises to C$1.3750.' },
]

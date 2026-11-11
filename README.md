# Forward Contract P/L Calculator — IS4350 Group 1

React + Vite + TypeScript + Tailwind + Recharts + Framer Motion.

```bash
npm install
npm run dev            # live demo at http://localhost:5173
npm test               # unit tests for the payoff maths
npm run build && npm run preview   # static build (works offline)
```

## Maths (from the lecture notes)
- Long (buyer): `(S_T − F) × n` · Short (seller): `(F − S_T) × n` · always zero-sum.
- Extras (Hull, ch. 5): fair forward `F0 = S0·e^((r+u−y)T)`, currency `S0·e^((r−r_f)T)`, value before maturity `(F0 − F)·e^(−rT)·n`.

## 5-minute demo script
1. **0:00–0:45 Concept** – forward = OTC deal to buy/sell later at a price fixed today; value 0 at start (Learn tab).
2. **0:45–1:45 Inputs** – click the *GBP/USD* preset (slide example): F 1.5410, n 250,000, S_T 1.6000 → buyer +$14,750.
3. **1:45–3:15 Buyer vs Seller** – drag the S_T slider below F: payoffs flip; point out zero-sum = 0.
4. **3:15–4:00 Chart & scenarios** – payoff lines cross at F (break-even); ±10/20% table.
5. **4:00–4:45 Extras** – Pricing tab: how F is set (cost of carry); forwards vs futures table.
6. **4:45–5:00 Wrap-up** – hedgers vs speculators; limitations (no transaction cost / credit risk).

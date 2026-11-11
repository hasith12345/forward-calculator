import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '../lib/utils'

export const Card = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('rounded-card border-[length:var(--bw)] border-line bg-surface card-shadow', className)} {...p} />
)

export const CardTitle = ({ title, sub, aside }: { title: string; sub?: string; aside?: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {sub && <p className="mt-0.5 text-sm text-sub">{sub}</p>}
    </div>
    {aside}
  </div>
)

export function Field({ label, hint, error, prefix, suffix, className, ...p }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string; prefix?: string; suffix?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-sm font-semibold text-sub">{label}</span>
      <span className={cn('flex h-12 items-center rounded-ctl border-[length:var(--bw)] bg-surface px-3.5 transition focus-within:ring-4', error ? 'border-loss focus-within:ring-loss/15' : 'border-field focus-within:border-brand focus-within:ring-brand/15')}>
        {prefix && <span className="mr-1.5 font-medium text-sub">{prefix}</span>}
        <input {...p} className="num min-w-0 flex-1 bg-transparent text-xl font-semibold text-ink" />
        {suffix && <span className="ml-2 truncate text-sm font-medium text-sub">{suffix}</span>}
      </span>
      {error ? <span className="mt-1 block text-sm font-medium text-loss">{error}</span> : hint ? <span className="mt-1 block text-sm text-sub">{hint}</span> : null}
    </label>
  )
}

export const Pill = ({ active, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) => (
  <button
    className={cn('h-10 cursor-pointer rounded-full border-[length:var(--bw)] px-4 text-sm font-semibold transition', active ? 'border-brand bg-brand text-onbrand shadow-sm' : 'border-field bg-surface text-ink hover:border-brand hover:text-brand', className)}
    {...p}
  />
)

export const Slider = ({ className, ...p }: React.ComponentProps<typeof SliderPrimitive.Root>) => (
  <SliderPrimitive.Root className={cn('relative flex h-8 w-full touch-none select-none items-center', className)} {...p}>
    <SliderPrimitive.Track className="relative h-2 grow rounded-full bg-ink/15">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-brand" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb aria-label="Market price at maturity" className="block h-7 w-7 cursor-grab rounded-full border-4 border-brand bg-surface shadow-md outline-none transition focus-visible:ring-4 focus-visible:ring-brand/25 active:cursor-grabbing" />
  </SliderPrimitive.Root>
)

export const Stat = ({ label, value, tone }: { label: string; value: React.ReactNode; tone?: 'gain' | 'loss' }) => (
  <div>
    <div className="text-sm font-medium text-sub">{label}</div>
    <div className={cn('num mt-0.5 text-xl font-semibold', tone === 'gain' && 'text-gain', tone === 'loss' && 'text-loss')}>{value}</div>
  </div>
)

import { describe, expect, it } from 'vitest'
import { calcForward, validate, fairForwardPrice, currencyForwardPrice } from './forward'

describe('calcForward', () => {
  it('price rise: buyer gains, seller loses', () => {
    const r = calcForward({ F: 100, n: 1000, ST: 110 })
    expect(r.longPL).toBe(10000)
    expect(r.shortPL).toBe(-10000)
    expect(r.longStatus).toBe('gain')
    expect(r.shortStatus).toBe('loss')
  })
  it('price fall reverses', () => {
    const r = calcForward({ F: 100, n: 1000, ST: 90 })
    expect(r.longPL).toBe(-10000)
    expect(r.shortPL).toBe(10000)
  })
  it('break-even', () => {
    const r = calcForward({ F: 100, n: 5, ST: 100 })
    expect(r.longStatus).toBe('even')
  })
  it('is zero-sum', () => {
    for (let i = 0; i < 100; i++) {
      const r = calcForward({ F: Math.random() * 500 + 1, n: Math.random() * 1e5 + 1, ST: Math.random() * 600 })
      expect(Math.abs(r.zeroSum)).toBeLessThan(1e-6)
    }
  })
  it('matches GBP slide example', () => {
    expect(calcForward({ F: 1.541, n: 250000, ST: 1.6 }).longPL).toBeCloseTo(14750, 6)
    expect(calcForward({ F: 1.541, n: 250000, ST: 1.5 }).longPL).toBeCloseTo(-10250, 6)
  })
})

describe('validate', () => {
  it('rejects empty, zero and negative', () => {
    expect(validate({ F: '', n: '1', ST: '1' }).errors.F).toBeTruthy()
    expect(validate({ F: '1', n: '0', ST: '1' }).errors.n).toBeTruthy()
    expect(validate({ F: '1', n: '1', ST: '-1' }).errors.ST).toBeTruthy()
    expect(validate({ F: 'abc', n: '1', ST: '1' }).values).toBeNull()
  })
  it('accepts decimals', () => {
    expect(validate({ F: '1.541', n: '250000', ST: '0' }).values).toEqual({ F: 1.541, n: 250000, ST: 0 })
  })
})

describe('pricing extras', () => {
  it('cost of carry', () => {
    expect(fairForwardPrice(40, 0.05, 0.25)).toBeCloseTo(40.503, 3)
  })
  it('currency parity', () => {
    expect(currencyForwardPrice(1.5, 0.05, 0.03, 1)).toBeCloseTo(1.5303, 3)
  })
})

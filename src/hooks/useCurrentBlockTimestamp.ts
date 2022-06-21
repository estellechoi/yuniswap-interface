import { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'

export default function useCurrentBlockTimestamp(): BigNumber | undefined {
  const result: string | undefined = '0'
  // .. wip
  return useMemo(() => (typeof result === 'string' ? BigNumber.from(result) : result), [result])
}

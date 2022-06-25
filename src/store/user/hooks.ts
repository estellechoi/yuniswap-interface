import { Percent, Token } from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import { L2_CHAIN_IDS } from 'constants/chains'
import { SupportedLocale } from 'constants/locales'
import { DONATION_END_TIMESTAMP, L2_DEADLINE_FROM_NOW } from 'constants/misc'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import JSBI from 'jsbi'
import { useCallback, useMemo } from 'react' // This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  addSerializedToken,
  removeSerializedToken,
  updateHideClosedPositions,
  updateShowDonationLink,
  updateShowSurveyPopup,
  updateUserClientSideRouter,
  updateUserDarkMode,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserLocale,
  updateUserSlippageTolerance,
  UserState,
} from 'store/user/reducer'
import { SerializedPair, SerializedToken } from 'store/user/types'

function useUserSelector(): UserState {
  return useAppSelector(({ user }) => user)
}

function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  }
}

function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  )
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: serializeToken(pair.token0),
    token1: serializeToken(pair.token1),
  }
}

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useUserSelector()
  return userDarkMode ?? matchesDarkMode
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch()
  const isDarkMode = useIsDarkMode() // current state

  const toggleDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !isDarkMode }))
  }, [isDarkMode, dispatch])

  return [isDarkMode, toggleDarkMode]
}

export function useUserLocale(): SupportedLocale | null {
  const { userLocale } = useUserSelector()
  return userLocale
}

export function useUserLocalManager(): [SupportedLocale | null, (newLocale: SupportedLocale) => void] {
  const dispatch = useAppDispatch()
  const userLocale = useUserLocale()

  const setLocale = useCallback(
    (newLocale: SupportedLocale) => {
      dispatch(updateUserLocale({ userLocale: newLocale }))
    },
    [dispatch]
  )
  return [userLocale, setLocale]
}

export function useIsExpertMode(): boolean {
  const { userExpertMode } = useUserSelector()
  return userExpertMode
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch()
  const isExperMode = useIsExpertMode()

  const toggleExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !isExperMode }))
  }, [isExperMode, dispatch])

  return [isExperMode, toggleExpertMode]
}

export function useShowSurveyPopup(): [boolean | undefined, (showPopup: boolean) => void] {
  const dispatch = useAppDispatch()
  const { showSurveyPopup } = useUserSelector()

  const setShowSurveyPopup = useCallback(
    (showPopup: boolean) => {
      dispatch(updateShowSurveyPopup({ showSurveyPopup: showPopup }))
    },
    [dispatch]
  )

  return [showSurveyPopup, setShowSurveyPopup]
}

export function useShowDonationLink(): [boolean | undefined, (showLink: boolean) => void] {
  const dispatch = useAppDispatch()
  const { showDonationLink } = useUserSelector()
  const setShowDonationLink = useCallback(
    (showLink: boolean) => {
      dispatch(updateShowDonationLink({ showDonationLink: showLink }))
    },
    [dispatch]
  )

  const timestamp = useCurrentBlockTimestamp()
  const isDurationOver = timestamp ? timestamp.toNumber() > DONATION_END_TIMESTAMP : false
  const isDonationLinkVisible = showDonationLink !== false && !isDurationOver

  return [isDonationLinkVisible, setShowDonationLink]
}

export function useClientSideRouter(): [boolean, (clientSideRouter: boolean) => void] {
  const dispatch = useAppDispatch()
  const { userClientSideRouter } = useUserSelector()

  const setClientSideRouter = useCallback(
    (clientSideRouter: boolean) => {
      dispatch(updateUserClientSideRouter({ userClientSideRouter: clientSideRouter }))
    },
    [dispatch]
  )

  return [userClientSideRouter, setClientSideRouter]
}

export function useUserSlippageTolerance(): Percent | 'auto' {
  // userSlippageTolerance in bips like 0.01% → (1 / 10_000) as a unit
  const { userSlippageTolerance } = useUserSelector()

  return useMemo(
    () => (userSlippageTolerance === 'auto' ? 'auto' : new Percent(userSlippageTolerance, 10_000)),
    [userSlippageTolerance]
  )
}

export function useSetSlippageTolerance(): (slippageTolerance: Percent | 'auto') => void {
  const dispatch = useAppDispatch()

  const setSlippageTolerance = useCallback(
    (slippageTolerance: Percent | 'auto') => {
      let userSlippageTolerance: number | 'auto'

      try {
        userSlippageTolerance =
          slippageTolerance === 'auto' ? 'auto' : JSBI.toNumber(slippageTolerance.multiply(10_000).quotient)
      } catch (err) {
        userSlippageTolerance = 'auto'
      }

      dispatch(updateUserSlippageTolerance({ userSlippageTolerance }))
    },
    [dispatch]
  )

  return setSlippageTolerance
}

/**
 * Same as above but replaces the auto with a default value
 * @param defaultSlippageTolerance the default value to replace auto with
 */
export function useUserSlippageToleranceWithDefault(defaultSlippageTolerance: Percent): Percent {
  const allowedSlippage = useUserSlippageTolerance()
  return useMemo(
    () => (allowedSlippage === 'auto' ? defaultSlippageTolerance : allowedSlippage),
    [allowedSlippage, defaultSlippageTolerance]
  )
}

export function useUserHideClosedPositions(): [boolean, (hideClosedPositions: boolean) => void] {
  const dispatch = useAppDispatch()

  const { userHideClosedPositions } = useUserSelector()

  const setHideClosedPositions = useCallback(
    (hideClosedPositions: boolean) => {
      dispatch(updateHideClosedPositions({ userHideClosedPositions: hideClosedPositions }))
    },
    [dispatch]
  )

  return [userHideClosedPositions, setHideClosedPositions]
}

export function useURLWarningVisible(): boolean {
  const { URLWarningVisible } = useUserSelector()
  return URLWarningVisible
}

// set user deadline
export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const { userDeadline } = useUserSelector()

  const isOnL2 = Boolean(chainId && L2_CHAIN_IDS.includes(chainId))
  const deadline = isOnL2 ? L2_DEADLINE_FROM_NOW : userDeadline

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }))
    },
    [dispatch]
  )

  return [deadline, setUserDeadline]
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useAppDispatch()
  const addUserToken = useCallback(
    (token: Token) => {
      const serializedToken = serializeToken(token)
      dispatch(addSerializedToken({ serializedToken }))
    },
    [dispatch]
  )

  return addUserToken
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  const dispatch = useAppDispatch()
  const removeUserAddedToken = useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch]
  )

  return removeUserAddedToken
}

export function useUserAddedToken(): Token[] {
  const { chainId } = useActiveWeb3React()
  const { tokens } = useUserSelector()

  return useMemo(() => {
    if (!chainId) return []
    const tokensMap: Token[] = Object.values(tokens[chainId]).map(deserializeToken)
    return tokensMap
  }, [tokens, chainId])
}

// Pair hooks are coming here

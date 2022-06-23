import { Percent } from '@uniswap/sdk-core'
import { SupportedLocale } from 'constants/locales'
import { DONATION_END_TIMESTAMP } from 'constants/misc'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import JSBI from 'jsbi'
import { useCallback, useMemo } from 'react' // This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  updateHideClosedPositions,
  updateShowDonationLink,
  updateShowSurveyPopup,
  updateUserClientSideRouter,
  updateUserDarkMode,
  updateUserExpertMode,
  updateUserLocale,
  updateUserSlippageTolerance,
} from 'store/user/reducer'

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useAppSelector(({ user }) => user)
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
  const { userLocale } = useAppSelector(({ user }) => user)
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
  const { userExpertMode } = useAppSelector(({ user }) => user)
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
  const { showSurveyPopup } = useAppSelector(({ user }) => user)

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
  const { showDonationLink } = useAppSelector(({ user }) => user)
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
  const { userClientSideRouter } = useAppSelector(({ user }) => user)

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
  const { userSlippageTolerance } = useAppSelector(({ user }) => user)

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

  const { userHideClosedPositions } = useAppSelector(({ user }) => user)

  const setHideClosedPositions = useCallback(
    (hideClosedPositions: boolean) => {
      dispatch(updateHideClosedPositions({ userHideClosedPositions: hideClosedPositions }))
    },
    [dispatch]
  )

  return [userHideClosedPositions, setHideClosedPositions]
}

export function useURLWarningVisible(): boolean {
  const { URLWarningVisible } = useAppSelector(({ user }) => user)
  return URLWarningVisible
}

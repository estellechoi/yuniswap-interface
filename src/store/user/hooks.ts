import { SupportedLocale } from 'constants/locales'
import { DONATION_END_TIMESTAMP } from 'constants/misc'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { useCallback } from 'react' // This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  updateShowDonationLink,
  updateShowSurveyPopup,
  updateUserDarkMode,
  updateUserExpertMode,
  updateUserLocale,
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

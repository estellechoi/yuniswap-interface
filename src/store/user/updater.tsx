import { useEffect } from 'react'
import { useAppDispatch } from 'store/hooks'

import { updateMatchesDarkMode } from './reducer'

export default function Updater(): null {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const darkHandler = (mediaQueryListEvent: MediaQueryListEvent) => {
      dispatch(updateMatchesDarkMode({ matchesDarkMode: mediaQueryListEvent.matches }))
    }

    const matchesDarkMode = window?.matchMedia('(prefers-color-scheme: dark)')
    dispatch(updateMatchesDarkMode({ matchesDarkMode: matchesDarkMode.matches }))

    // cross browsers
    if (matchesDarkMode?.addListener) {
      matchesDarkMode.addListener(darkHandler)
    } else if (matchesDarkMode?.addEventListener) {
      matchesDarkMode?.addEventListener('change', darkHandler)
    }

    // remove listeners
    return () => {
      if (matchesDarkMode?.removeListener) {
        matchesDarkMode?.removeListener(darkHandler)
      } else if (matchesDarkMode?.removeEventListener) {
        matchesDarkMode?.removeEventListener('change', darkHandler)
      }
    }
  }, [dispatch])
  return null
}

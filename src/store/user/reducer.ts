import { createSlice } from '@reduxjs/toolkit'

import { Wallet } from './../../connectors'
import { SupportedLocale } from './../../constants/locales'
import { DEFAULT_DEADLINE_FROM_NOW } from './../../constants/misc'
import { SerializedPair, SerializedToken } from './types'

const currentTimestamp = () => new Date().getTime()
const pairKey = (token0Address: string, token1Address: string) => `${token0Address}:${token1Address}`

export interface UserState {
  selectedWallet?: Wallet
  selectedWalletBackfilled: boolean
  matchesDarkMode: boolean // whether the dark mode media query matches
  userDarkMode: boolean | null
  userLocale: SupportedLocale | null
  userExpertMode: boolean
  userClientSideRouter: boolean // whether routes should be calculated with the client side router only
  userHideClosedPositions: boolean
  userSlippageTolerance: number | 'auto' // user defined slippage tolerance in bips, used in all txns
  userSlippageToleranceHasBeenMigratedToAuto: boolean // temporary flag for migration status
  userDeadline: number
  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }
  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }
  timestamp: number
  URLWarningVisible: boolean
  showSurveyPopup: boolean | undefined // undefined means has not gone through A/B split yet
  showDonationLink: boolean
}

const initialState: UserState = {
  selectedWallet: undefined,
  selectedWalletBackfilled: false,
  matchesDarkMode: false,
  userDarkMode: null,
  userExpertMode: false,
  userLocale: null,
  userClientSideRouter: false,
  userHideClosedPositions: false,
  userSlippageTolerance: 'auto',
  userSlippageToleranceHasBeenMigratedToAuto: true,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  pairs: {},
  timestamp: currentTimestamp(),
  URLWarningVisible: true,
  showSurveyPopup: undefined,
  showDonationLink: true,
}

export const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateSelectedWallet(state, { payload: { wallet } }) {
      state.selectedWallet = wallet
      state.selectedWalletBackfilled = true
    },
    updateUserDarkMode(state, { payload: { userDarkMode } }) {
      state.userDarkMode = userDarkMode
      state.timestamp = currentTimestamp()
    },
    updateMatchesDarkMode(state, { payload: { matchesDarkMode } }) {
      state.matchesDarkMode = matchesDarkMode
      state.timestamp = currentTimestamp()
    },
    updateUserExpertMode(state, { payload: { userExpertMode } }) {
      state.userExpertMode = userExpertMode
      state.timestamp = currentTimestamp()
    },
    updateUserLocale(state, { payload: { userLocale } }) {
      state.userLocale = userLocale
      state.timestamp = currentTimestamp()
    },
    updateUserSlippageTolerance(state, { payload: { userSlippageTolerance } }) {
      state.userSlippageTolerance = userSlippageTolerance
      state.timestamp = currentTimestamp()
    },
    updateUserDeadline(state, { payload: { userDeadline } }) {
      state.userDeadline = userDeadline
      state.timestamp = currentTimestamp()
    },
    updateUserClientSideRouter(state, { payload: { userClientSideRouter } }) {
      state.userClientSideRouter = userClientSideRouter
    },
    updateHideClosedPositions(state, { payload: { userHideClosedPositions } }) {
      state.userHideClosedPositions = userHideClosedPositions
    },
    updateShowSurveyPopup(state, { payload: { showSurveyPopup } }) {
      state.showSurveyPopup = showSurveyPopup
    },
    updateShowDonationLink(state, { payload: { showDonationLink } }) {
      state.showDonationLink = showDonationLink
    },
    addSerializedToken(state, { payload: { serializedToken } }) {
      if (!state.tokens) {
        state.tokens = {}
      }

      state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {}
      state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken
      state.timestamp = currentTimestamp()
    },
    removeSerializedToken(state, { payload: { address, chainId } }) {
      if (!state.tokens) {
        state.tokens = {}
      }

      state.tokens[chainId] = state.tokens[chainId] || {}
      delete state.tokens[chainId][address]
      state.timestamp = currentTimestamp()
    },
    addSerializedPair(state, { payload: { serializedPair } }) {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const chainId = serializedPair.token0.chainId
        state.pairs[chainId] = state.pairs[chainId] || {}
        state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair
      }
      state.timestamp = currentTimestamp()
    },
    removeSerializedPair(state, { payload: { chainId, tokenAAddress, tokenBAddress } }) {
      if (state.pairs[chainId]) {
        // just delete both keys if either exists
        delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)]
        delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)]
      }
      state.timestamp = currentTimestamp()
    },
  },
})

export const {
  updateSelectedWallet,
  addSerializedPair,
  addSerializedToken,
  removeSerializedPair,
  removeSerializedToken,
  updateHideClosedPositions,
  updateMatchesDarkMode,
  updateShowDonationLink,
  updateShowSurveyPopup,
  updateUserClientSideRouter,
  updateUserDarkMode,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserLocale,
  updateUserSlippageTolerance,
} = slice.actions

export default slice.reducer

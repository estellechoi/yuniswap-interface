import { Web3ReactProvider } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { BACKFILLABLE_WALLETS, getConnectorForWallet, gnosisSafe, injected, network, useConnectors } from 'connectors'
import { ReactNode, useEffect } from 'react'
import { useAppSelector } from 'store/hooks'
import { isMobile } from 'utils/userAgent'

const connect = async (connector: Connector) => {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly()
    } else {
      await connector.activate()
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
  }
}

export default function Web3Provider({ children }: { children: ReactNode }) {
  const { selectedWalletBackfilled } = useAppSelector(({ user }) => user)
  const { selectedWallet } = useAppSelector(({ user }) => user)

  const connectors = useConnectors(selectedWallet)

  const isMetaMask = !!window.ethereum?.isMetaMask // why using double !! ? to force type boolean

  useEffect(() => {
    // subscribe if any web3 connector is requested
    connect(gnosisSafe)
    connect(network)

    if (isMobile && isMetaMask) {
      injected.activate()
    } else if (selectedWallet) {
      connect(getConnectorForWallet(selectedWallet))
    } else if (!selectedWalletBackfilled) {
      BACKFILLABLE_WALLETS.map(getConnectorForWallet).forEach(connect)
    } // this is only run once on mount
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
}

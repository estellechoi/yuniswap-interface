import './index.css'
import '@reach/dialog/styles.css'

import App from 'App'
import BlockList from 'components/BlockList'
import Web3Provider from 'components/Web3Provider'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import reportWebVitals from 'reportWebVitals'
import store from 'store'
import UserUpdater from 'store/user/updater'
import ThemeProvider from 'theme'
import RadialGradientByChainUpdater from 'theme/RadialGradientByChainUpdater'

function Updaters() {
  return (
    <>
      <RadialGradientByChainUpdater />
      <UserUpdater />
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Web3Provider>
          <BlockList>
            <Updaters />
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </BlockList>
        </Web3Provider>
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

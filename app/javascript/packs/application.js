import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import rootReducer from '../store/reducers'
import { Provider } from 'react-redux'

import App from '../components/App'

document.addEventListener('DOMContentLoaded', () => {
  let reactElement = document.getElementById('app')
  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )

  const appWithProvider = <Provider store={store}><App /></Provider>
  if (reactElement) {
    render(appWithProvider, reactElement)
  }
})

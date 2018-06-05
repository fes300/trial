import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { App } from '@components/App'

interface AppModel { counter: number }
const element = document.getElementById('example')

let initialState: AppModel = {
  counter: 0,
}

const increase = (_event: any) => {
  initialState.counter = initialState.counter + 1;
  
  ReactDOM.render(view(initialState), element)
}

const view = (model: AppModel) => (
  <App count={model.counter} increase={increase} />
)

ReactDOM.render(
  view(initialState),
  element,
)

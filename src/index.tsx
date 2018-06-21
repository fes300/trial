import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { App } from '@components/App'

/* app code */

const createView = (update: (value: number) => void) => {
  const add = (value: number) => (_event: any) => {
    update(value)
  }

  const view = (model: AppModel) => (
    <App count={model.counter} decrease={add(-1)} increase={add(1)} />
  )

  return view
}

/* meiosis code */

interface AppModel { counter: number }

const element = document.getElementById('example')

let initialState: AppModel = {
  counter: 0,
}

const update = (value: number) => {
  initialState.counter = initialState.counter + value;
  
  ReactDOM.render(view(initialState), element)
}

const view = createView(update)

ReactDOM.render(
  view(initialState),
  element,
)

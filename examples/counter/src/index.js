// @flow
import React from "react"
import { render } from "react-dom"
import Counter from "./containers/Counter"
import Elm from "./modules/Main.elm"
import { Provider } from "../../../src"

const initialState = { value: 0, step: 1 }

render(
  <Provider module={Elm.Main} initialState={initialState}>
    <Counter />
  </Provider>,
  document.getElementById("root")
)

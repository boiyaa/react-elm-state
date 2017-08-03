// @flow
import React from "react"
import { render } from "react-dom"
import Counter from "./containers/Counter"
import Elm from "./modules/Main.elm"
import { Provider } from "../../../src"

const ports = Elm.Main.worker().ports

render(
  <Provider ports={ports}>
    <Counter />
  </Provider>,
  document.getElementById("root")
)

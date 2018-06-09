# react-elm-state

[![Greenkeeper badge](https://badges.greenkeeper.io/boiyaa/react-elm-state.svg)](https://greenkeeper.io/)

### Installation

```sh
$ npm install --save react-elm-state
```

### The Gist

`index.js`

```js
import React from "react"
import { render } from "react-dom"
import { Provider, withElm } from "react-elm-state"
import Elm from "Main.elm"

const Counter = ({ value, onIncrease }) =>
  <div>
    <p>{value}</p>
    <button onClick={onIncrease}>+</button>
  </div>

const ConnectedCounter = withElm(["value", "onIncrease"])(Counter)

const flags = { value: 0 }

render(
  <Provider module={Elm.Main} flags={flags}>
    <ConnectedCounter />
  </Provider>,
  document.getElementById("root")
)
```

`Main.elm`

```elm
port module Main exposing (..)

import Json.Decode exposing (Value)

type alias Model =
    { value : Int }

port value : Int -> Cmd msg

port onIncrease : (Value -> msg) -> Sub msg

type Msg
    = Increase

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ onIncrease <| always Increase
        ]

init : Model -> ( Model, Cmd Msg )
init flags =
    ( flags, Cmd.none )

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Increase ->
            let
                newValue =
                    model.value + 1
            in
                ( { model | value = newValue }, value newValue )

main : Program Model Model Msg
main =
    Platform.programWithFlags
        { init = init
        , update = update
        , subscriptions = subscriptions
        }
```

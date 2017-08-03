port module Main exposing (..)

import Html.Events exposing (targetValue)
import Json.Decode exposing (Value, decodeValue, index)
import Process exposing (sleep)
import Task exposing (perform)
import Time exposing (millisecond)


-- MODEL


type alias Model =
    { value : Int, step : Int }



-- PORT


port value : Int -> Cmd msg


port step : Int -> Cmd msg


port onStepChange : (Value -> msg) -> Sub msg


port onIncrease : (Value -> msg) -> Sub msg


port onIncreaseAsync : (Value -> msg) -> Sub msg


port onDecrease : (Value -> msg) -> Sub msg


port onDecreaseAsync : (Value -> msg) -> Sub msg



-- Msg


type Msg
    = StepChange Int
    | Increase
    | IncreaseAsync
    | Decrease
    | DecreaseAsync



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ onStepChange <| decodeStep >> StepChange
        , onIncrease <| always Increase
        , onIncreaseAsync <| always IncreaseAsync
        , onDecrease <| always Decrease
        , onDecreaseAsync <| always DecreaseAsync
        ]


decodeEventTargetValue : Value -> String
decodeEventTargetValue =
    Result.withDefault "" << (decodeValue <| index 0 targetValue)


decodeStep : Value -> Int
decodeStep =
    Result.withDefault 1 << String.toInt << decodeEventTargetValue



-- UPDATE


init : ( Model, Cmd Msg )
init =
    ( Model 0 1, Cmd.batch [ value 0, step 1 ] )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        StepChange newStep ->
            ( { model | step = newStep }, step newStep )

        Increase ->
            let
                newValue =
                    model.value + model.step
            in
                ( { model | value = newValue }, value newValue )

        IncreaseAsync ->
            ( model, increaseInSec )

        Decrease ->
            let
                newValue =
                    model.value - model.step
            in
                ( { model | value = newValue }, value newValue )

        DecreaseAsync ->
            ( model, decreaseInSec )


increaseInSec : Cmd Msg
increaseInSec =
    setTimeout Increase 1000


decreaseInSec : Cmd Msg
decreaseInSec =
    setTimeout Decrease 1000


setTimeout : Msg -> Float -> Cmd Msg
setTimeout msg delay =
    let
        command =
            always msg

        task =
            sleep <| delay * millisecond
    in
        perform command task



-- MAIN


main : Program Never Model Msg
main =
    Platform.program
        { init = init
        , update = update
        , subscriptions = subscriptions
        }

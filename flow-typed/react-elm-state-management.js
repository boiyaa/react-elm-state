declare type Ports<T> = {
  [T]:
    | {
        send: (data: mixed) => void
      }
    | {
        subscribe: (callback: (data: mixed) => void) => void
      }
    | {
        unsubscribe: (callback: (data: mixed) => void) => void
      }
}

declare class Provider extends React$Component<
  void,
  { ports: Ports<string>, children?: any },
  void
> {}

declare class ConnectedComponent<OP, EP> extends React$Component<void, OP, EP> {
  static contextTypes: { ports: Ports<$Keys<EP>> },
  props: OP,
  state: EP
}

declare type SFC<P> = (props: P) => React$Element<*>
declare type ComponentClass<P> = Class<React$Component<*, P, *>>

declare type WithElm<OP, EP> = (
  portNames: Array<$Keys<EP>>
) => (
  component: SFC<OP & EP> | ComponentClass<OP & EP>
) => Class<ConnectedComponent<OP, EP>>

declare var withElm: WithElm<OP, EP>

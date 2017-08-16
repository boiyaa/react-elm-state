import React, { Component } from "react"
import PropTypes from "prop-types"

export class Provider extends Component {
  static propTypes = {
    children: PropTypes.element,
    module: PropTypes.object,
    initialState: PropTypes.object
  }

  static childContextTypes = {
    ports: PropTypes.object,
    initialState: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      ports: props.module.worker(props.initialState).ports
    }
  }

  getChildContext() {
    return {
      ports: this.state.ports,
      initialState: this.props.initialState
    }
  }

  render() {
    return this.props.children
  }
}

export const withElm = propNames => WrappedComponent =>
  class extends Component {
    static contextTypes = {
      ports: PropTypes.object,
      initialState: PropTypes.object
    }

    constructor(props, context) {
      super(props, context)

      const state = {}

      propNames.forEach(name => {
        if (this.context.ports[name] && this.context.ports[name].send) {
          state[name] = (...args) => {
            this.context.ports[name].send(args)
          }
        }

        if (this.context.ports[name] && this.context.ports[name].subscribe) {
          this.handleSubscribe[name] = this.handleSubscribe.bind(this, name)

          if (this.context.initialState.hasOwnProperty(name)) {
            state[name] = this.context.initialState[name]
          }
        }
      })

      this.state = state
    }

    componentDidMount() {
      propNames.forEach(name => {
        if (this.context.ports[name] && this.context.ports[name].subscribe) {
          this.context.ports[name].subscribe(this.handleSubscribe[name])
        }
      })
    }

    componentWillUnmount() {
      propNames.forEach(name => {
        if (this.context.ports[name] && this.context.ports[name].unsubscribe) {
          this.context.ports[name].unsubscribe(this.handleSubscribe[name])
        }
      })
    }

    handleSubscribe(name, data) {
      this.setState({ [name]: data })
    }

    render() {
      const props = {
        ...this.props,
        ...this.state
      }
      return <WrappedComponent {...props} />
    }
  }

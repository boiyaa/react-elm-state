import React, { Component } from "react"
import PropTypes from "prop-types"

export class Provider extends Component {
  static propTypes = {
    children: PropTypes.element,
    ports: PropTypes.object
  }

  static childContextTypes = {
    ports: PropTypes.object
  }

  getChildContext() {
    return { ports: this.props.ports }
  }

  render() {
    return this.props.children
  }
}

export const withElm = (WrappedComponent, propNames) =>
  class extends Component {
    static contextTypes = {
      ports: PropTypes.object
    }

    constructor(props, context) {
      super(props, context)
      this.initState()
    }

    initState() {
      const state = {}

      propNames.forEach(name => {
        if (this.context.ports[name] && this.context.ports[name].send) {
          state[name] = (...args) => {
            this.context.ports[name].send(args)
          }
        }

        if (this.context.ports[name] && this.context.ports[name].subscribe) {
          // state[name] = null
          this.handleSubscribe[name] = this.handleSubscribe.bind(this, name)
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
      return <WrappedComponent {...this.state} />
    }
  }

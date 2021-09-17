import * as React from "react"
import { CSSProperties } from "react"
import * as ReactDOM from "react-dom"

import "./ui.css"
import { string } from "prop-types"
import { IPluginMessage } from "./plugin"

declare function require(path: string): any

interface IProps {}

interface IState {}

const initialState: IState = {}

class App extends React.Component<IProps, IState> {
  // ===========================================================================
  // Lifecycle.
  // ===========================================================================

  readonly state: IState = initialState

  componentDidMount() {
    onmessage = (event: MessageEvent) => {
      if (event && event.data) {
        const pluginMessage = event.data.pluginMessage as IPluginMessage
      }
    }
  }

  // ===========================================================================
  // Render.
  // ===========================================================================

  render() {
    return (
      <div
        style={{
          fontFamily: App.figmaStyles.fontFamily,
          cursor: "default",
        }}
      >
        <button onClick={() => this.runPlugin()}>Logo Layout!</button>
      </div>
    )
  }

  // ===========================================================================
  // Helpers.
  // ===========================================================================

  // ===========================================================================
  // Events.
  // ===========================================================================

  private runPlugin = () => {
    const pluginMessage: IPluginMessage = {
      type: "run-plugin",
    }
    parent.postMessage(
      {
        pluginMessage: pluginMessage,
      },
      "*"
    )
  }

  // ==========================================================================
  // Styles.
  // ===========================================================================

  private static figmaStyles = {
    border: "1px solid #e5e5e5",
    fontFamily: "Inter, sans-serif",
    fontSize: {
      base: 11,
    },
    fontWeight: {
      bold: 600,
    },
    color: {
      hover: "rgba(0,0,0,.06)",
    },
    borderRadius: 3,
  }
}

ReactDOM.render(<App />, document.getElementById("react-page"))

import * as React from "react"
import { CSSProperties } from "react"
import * as ReactDOM from "react-dom"

import "./ui.css"
import { string } from "prop-types"
import { IPluginMessage } from "./plugin"

declare function require(path: string): any

interface IProps {}

interface IState {
  surfaceArea: number | null
}

const initialState: IState = { surfaceArea: 30000 }

class App extends React.Component<IProps, IState> {
  // ===========================================================================
  // Lifecycle.
  // ===========================================================================

  readonly state: IState = initialState
  private static searchInputRef = React.createRef<HTMLInputElement>()

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
        <input
          value={this.state.surfaceArea}
          style={{ width: "100%" }}
          onChange={this.handleSurfaceArea}
        ></input>
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

  private handleSurfaceArea = (e) => {
    this.setState({
      surfaceArea: e.target.value,
    })
  }

  private runPlugin = () => {
    const pluginMessage: IPluginMessage = {
      type: "run-plugin",
      data: { surfaceArea: this.state.surfaceArea },
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

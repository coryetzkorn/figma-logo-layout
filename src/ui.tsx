import * as React from "react"
import { CSSProperties } from "react"
import * as ReactDOM from "react-dom"

import "./ui.css"
import { string } from "prop-types"
import { IPluginMessage } from "./plugin"

declare function require(path: string): any

interface IProps {}

type Alignment = "left" | "center" | "right"

export interface IState {
  alignment: Alignment
  gridGap: number
  rowCount: number
}

const initialState: IState = {
  alignment: "center",
  gridGap: 20,
  rowCount: 3,
}

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
        {this.renderAlignmentControls()}
        {this.renderAdditionalControls()}
        {this.renderLayoutButton()}
      </div>
    )
  }

  private renderAlignmentControls() {
    return (
      <div>
        <label>Alignment</label>
        <div>
          <button
            onClick={(e) =>
              this.setState({
                alignment: "left",
              })
            }
          >
            l
          </button>
          <button
            onClick={(e) =>
              this.setState({
                alignment: "center",
              })
            }
          >
            c
          </button>
          <button
            onClick={(e) =>
              this.setState({
                alignment: "right",
              })
            }
          >
            r
          </button>
        </div>
      </div>
    )
  }

  private renderAdditionalControls() {
    return (
      <div>
        <div>
          <label>Grid gap</label>
          <input
            type="number"
            value={this.state.gridGap}
            maxLength={3}
            onChange={(e) =>
              this.setState({
                gridGap: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label>Rows</label>
          <input
            type="number"
            value={this.state.rowCount}
            maxLength={3}
            onChange={(e) =>
              this.setState({
                rowCount: parseInt(e.target.value),
              })
            }
          />
        </div>
      </div>
    )
  }

  private renderLayoutButton() {
    return (
      <>
        <button onClick={() => this.runPlugin()}>Logo Layout!</button>
      </>
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
      data: this.state,
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

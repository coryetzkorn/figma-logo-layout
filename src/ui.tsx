import * as React from "react"
import { CSSProperties } from "react"
import * as ReactDOM from "react-dom"
import "./ui.css"
import { IPluginMessage, IPluginState } from "./plugin"
import LeftIcon from "./components/LeftIcon"
import CenterIcon from "./components/CenterIcon"
import RightIcon from "./components/RightIcon"
import classnames from "classnames"
import GridGapIcon from "./components/GridGapIcon"
import JustifiedIcon from "./components/JustifiedIcon"

interface IProps {}

const initialState: IPluginState = {
  alignment: "center",
  gridGap: 20,
  rowCount: 3,
}

class App extends React.Component<IProps, IPluginState> {
  // ===========================================================================
  // Lifecycle.
  // ===========================================================================

  readonly state: IPluginState = initialState

  componentDidMount() {
    this.getLsState()
    onmessage = (event: MessageEvent) => {
      if (event && event.data) {
        const pluginMessage = event.data.pluginMessage as IPluginMessage
        if (pluginMessage.type === "ls-state-ready") {
          this.setState(pluginMessage.data as IPluginState)
        }
      }
    }
  }

  // ===========================================================================
  // Render.
  // ===========================================================================

  render() {
    return (
      <div className="main">
        {this.renderAlignmentControls()}
        {this.renderAdditionalControls()}
        {this.renderLayoutButton()}
      </div>
    )
  }

  private renderAlignmentControls() {
    return (
      <section>
        <label className="field-label">Alignment</label>
        <div>
          <button
            className={classnames("alignment-button", {
              selected: this.state.alignment === "left",
            })}
            onClick={(e) =>
              this.setState({
                alignment: "left",
              })
            }
          >
            <LeftIcon />
          </button>
          <button
            className={classnames("alignment-button", {
              selected: this.state.alignment === "center",
            })}
            onClick={(e) =>
              this.setState({
                alignment: "center",
              })
            }
          >
            <CenterIcon />
          </button>
          <button
            className={classnames("alignment-button", {
              selected: this.state.alignment === "right",
            })}
            onClick={(e) =>
              this.setState({
                alignment: "right",
              })
            }
          >
            <RightIcon />
          </button>
          <button
            className={classnames("alignment-button", {
              selected: this.state.alignment === "justified",
            })}
            onClick={(e) =>
              this.setState({
                alignment: "justified",
              })
            }
          >
            <JustifiedIcon />
          </button>
        </div>
      </section>
    )
  }

  private renderAdditionalControls() {
    return (
      <section>
        <div className="field-group">
          <div>
            <label className="field-label">Grid gap</label>
            <div className="input-wrap">
              <div className="grid-gap-icon">
                <GridGapIcon />
              </div>
              <input
                className="grid-gap-input"
                value={this.state.gridGap}
                maxLength={3}
                onFocus={this.handleInputFocus}
                onChange={(e) => {
                  const parsedValue = parseInt(e.target.value)
                  if (isNaN(parsedValue)) {
                    return
                  }
                  this.setState({
                    gridGap: parsedValue,
                  })
                }}
              />
            </div>
          </div>
          <div>
            <label className="field-label">Rows</label>
            <div className="input-wrap">
              <input
                value={this.state.rowCount}
                maxLength={3}
                onFocus={this.handleInputFocus}
                onChange={(e) => {
                  const parsedValue = parseInt(e.target.value)
                  if (isNaN(parsedValue)) {
                    return
                  }
                  this.setState({
                    rowCount: parsedValue,
                  })
                }}
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  private renderLayoutButton() {
    return (
      <section>
        <button className="primary-button" onClick={() => this.runPlugin()}>
          Apply Layout
        </button>
      </section>
    )
  }

  // ===========================================================================
  // Events.
  // ===========================================================================

  private handleInputFocus = (e) => e.target.select()

  private setLsRecents = (pluginState: IPluginState) => {
    const pluginMessage: IPluginMessage = {
      type: "set-ls-state",
      data: pluginState,
    }
    parent.postMessage(
      {
        pluginMessage: pluginMessage,
      },
      "*"
    )
  }

  private getLsState = () => {
    const pluginMessage: IPluginMessage = {
      type: "get-ls-state",
    }
    parent.postMessage(
      {
        pluginMessage: pluginMessage,
      },
      "*"
    )
  }

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
    // Save state to local storage after each plugin run
    this.setLsRecents(this.state)
  }
}

ReactDOM.render(<App />, document.getElementById("react-page"))

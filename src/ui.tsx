import classnames from "classnames"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import CenterIcon from "./components/CenterIcon"
import GridGapIcon from "./components/GridGapIcon"
import JustifiedIcon from "./components/JustifiedIcon"
import LeftIcon from "./components/LeftIcon"
import RightIcon from "./components/RightIcon"
import { Alignment, IPluginMessage, IPluginState } from "./plugin"
import "./ui.css"

const initialState: IPluginState = {
  alignment: "center",
  gridGap: 20,
  rowCount: 3,
}

function App() {
  const [state, setState] = React.useState<IPluginState>(initialState)

  React.useEffect(() => {
    getLsState()
    const handleMessage = (event: MessageEvent) => {
      if (event && event.data) {
        const pluginMessage = event.data.pluginMessage as IPluginMessage
        if (pluginMessage.type === "ls-state-ready") {
          setState(pluginMessage.data as IPluginState)
        }
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    e.target.select()

  const setLsRecents = (pluginState: IPluginState) => {
    const pluginMessage: IPluginMessage = {
      type: "set-ls-state",
      data: pluginState,
    }
    parent.postMessage({ pluginMessage }, "*")
  }

  const getLsState = () => {
    const pluginMessage: IPluginMessage = {
      type: "get-ls-state",
    }
    parent.postMessage({ pluginMessage }, "*")
  }

  const runPlugin = () => {
    const pluginMessage: IPluginMessage = {
      type: "run-plugin",
      data: state,
    }
    parent.postMessage({ pluginMessage }, "*")
    setLsRecents(state)
  }

  const renderAlignmentControls = () => (
    <section>
      <label className="field-label">Alignment</label>
      <div>
        {["left", "center", "right", "justified"].map((alignment) => (
          <button
            key={alignment}
            className={classnames("alignment-button", {
              selected: state.alignment === (alignment as Alignment),
            })}
            onClick={() =>
              setState({ ...state, alignment: alignment as Alignment })
            }
          >
            {alignment === "left" && <LeftIcon />}
            {alignment === "center" && <CenterIcon />}
            {alignment === "right" && <RightIcon />}
            {alignment === "justified" && <JustifiedIcon />}
          </button>
        ))}
      </div>
    </section>
  )

  const renderAdditionalControls = () => (
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
              value={state.gridGap}
              maxLength={3}
              onFocus={handleInputFocus}
              onChange={(e) => {
                const parsedValue = parseInt(e.target.value)
                if (!isNaN(parsedValue)) {
                  setState({ ...state, gridGap: parsedValue })
                }
              }}
            />
          </div>
        </div>
        <div>
          <label className="field-label">Rows</label>
          <div className="input-wrap">
            <input
              value={state.rowCount}
              maxLength={3}
              onFocus={handleInputFocus}
              onChange={(e) => {
                const parsedValue = parseInt(e.target.value)
                if (!isNaN(parsedValue)) {
                  setState({ ...state, rowCount: parsedValue })
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )

  const renderLayoutButton = () => (
    <section>
      <button className="primary-button" onClick={runPlugin}>
        Apply Layout
      </button>
    </section>
  )

  return (
    <div className="main">
      {renderAlignmentControls()}
      {renderAdditionalControls()}
      {renderLayoutButton()}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />)

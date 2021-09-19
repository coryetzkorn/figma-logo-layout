import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.css";
const initialState = {};
class App extends React.Component {
    constructor() {
        // ===========================================================================
        // Lifecycle.
        // ===========================================================================
        super(...arguments);
        this.state = initialState;
        // ===========================================================================
        // Helpers.
        // ===========================================================================
        // ===========================================================================
        // Events.
        // ===========================================================================
        this.runPlugin = () => {
            const pluginMessage = {
                type: "run-plugin",
            };
            parent.postMessage({
                pluginMessage: pluginMessage,
            }, "*");
        };
    }
    componentDidMount() {
        onmessage = (event) => {
            if (event && event.data) {
                const pluginMessage = event.data.pluginMessage;
            }
        };
    }
    // ===========================================================================
    // Render.
    // ===========================================================================
    render() {
        return (React.createElement("div", { style: {
                fontFamily: App.figmaStyles.fontFamily,
                cursor: "default",
            } },
            React.createElement("button", null, "l"),
            React.createElement("button", null, "c"),
            React.createElement("button", null, "r")));
    }
    renderLayoutButton() {
        return (React.createElement(React.Fragment, null,
            React.createElement("button", { onClick: () => this.runPlugin() }, "Logo Layout!")));
    }
}
// ==========================================================================
// Styles.
// ===========================================================================
App.figmaStyles = {
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
};
ReactDOM.render(React.createElement(App, null), document.getElementById("react-page"));

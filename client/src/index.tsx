import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";

import * as serviceWorker from "./service-worker";

import "./index.scss";

import {App} from "./components";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

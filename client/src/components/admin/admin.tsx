import React from "react";
import "./admin.scss";
import {RoundButton} from "../";

export default class Admin extends React.Component {
    componentDidMount(): void {
        localStorage.setItem("isAdmin", "true");
    }

    render() {
        return <div>
            <h1 className="text-center">Admin panel</h1>

            <div className="text-center">
                <div className="admin-box">
                    <div className="file-upload-rectangle">

                        <i className="material-icons-outlined upload-icon">backup</i>

                        <div className="upload-text">
                            <p>Drop your file here, or <span id="browse-files">browse</span></p>
                            <p>Supports <i>json</i></p>
                        </div>

                    </div>

                    <input type="password" placeholder="Passwort"/>

                    <RoundButton type="secondary" class="upload-button">Hochladen</RoundButton>
                </div>
            </div>

        </div>;
    }
};
;
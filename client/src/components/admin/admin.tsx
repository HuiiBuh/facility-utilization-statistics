import React from "react";
import "./admin.scss";
import {RoundButton} from "../";

export default class Admin extends React.Component {
    componentDidMount(): void {
        localStorage.setItem("isAdmin", "true");
    }

    callUploadFileDialog(event: React.MouseEvent<HTMLSpanElement>) {
        const fileUpload = document.querySelector<HTMLInputElement>("input[type='file']");
        if (fileUpload) fileUpload.click();
    }

    render() {

        return <div>
            <h1 className="text-center">Admin panel</h1>

            <div className="text-center">
                <div className="admin-box">
                    <div className="file-upload-rectangle">

                        <i className="material-icons-outlined upload-icon">backup</i>

                        <div className="upload-text">
                            <p>Drop your file here, or <span id="browse-files"
                                                             onClick={this.callUploadFileDialog}>browse</span>
                                <input style={{display: "none"}} type="file"/>
                            </p>
                            <p>Supports <i>json</i></p>
                        </div>

                    </div>

                    <input type="password" placeholder="Passwort"/>
                    <div className="custom-select">
                        <select>
                            <option value="blöckle">Blöckle</option>
                            <option value="kletterbox">Kletterbox</option>
                        </select>
                    </div>

                    <RoundButton type="secondary" class="upload-button">Hochladen</RoundButton>
                </div>
            </div>

        </div>;
    }
};

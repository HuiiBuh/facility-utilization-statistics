import React from "react";
import {RoundButton} from "../";
import "./admin.scss";

interface State {
    currentFile: string | null
}

export default class Admin extends React.Component {

    state: State = {
        currentFile: null
    };

    /**
     * Set the admin panel as visible
     */
    componentDidMount(): void {
        localStorage.setItem("isAdmin", "true");
        document.title = "Admin";
    }

    /**
     * Open the upload dialog
     */
    callUploadFileDialog = (_: React.MouseEvent<HTMLSpanElement>) => {
        const fileUpload = document.querySelector<HTMLInputElement>("input[type='file']");
        if (fileUpload) fileUpload.click();
    };

    /**
     * Update the selected file preview
     * @param event The event with the file input as target
     */
    changeFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let fileName;
        if (event.target.files && event.target.files.length > 0) {
            fileName = event.target.files[0].name;
        }

        this.setState({currentFile: fileName});
    };

    /**
     * Remove the file from the input
     */
    removeFile = () => {
        const fileUpload = document.querySelector<HTMLInputElement>("input[type='file']");
        if (fileUpload) fileUpload.value = "";
        this.setState({currentFile: null});
    };

    /**
     * Upload the file to the server
     */
    uploadFile = async () => {
        const passwordInput = document.querySelector<HTMLInputElement>("input[type='password']");
        const fileInput = document.querySelector<HTMLInputElement>("input[type='file']");
        const facilitySelect = document.querySelector<HTMLSelectElement>("select");

        const password = passwordInput?.value;
        //@ts-ignore
        const file: File = fileInput.files[0];
        const facility = facilitySelect?.value;

        if (!(facility && file && password)) return;

        const formData: FormData = new FormData();
        formData.append("file", file);
        formData.append("accessKey", password);
        const url = `/api/facility/${facility}/upload/`;

        const response: Response = await fetch(url, {method: "POST", body: formData});
        if (!response.ok) {
            console.log(await response.json());
            return;
        }


    };

    render() {
        return <div>
            <h1 className="text-center">Admin panel</h1>

            <div className="text-center">
                <div className="admin-box">

                    <div className="file-upload-rectangle">

                        <i className="material-icons-outlined upload-icon">backup</i>

                        <div className="upload-text">


                            {!this.state.currentFile &&
                            <div>
                                <p>
                                    <span>Drop your file here, or </span>
                                    <span className="pointer primary-text"
                                          onClick={this.callUploadFileDialog}>browse</span>
                                </p>
                                <p>Supports <i>json</i></p>
                            </div>
                            }
                            {this.state.currentFile &&
                            <div className="v-center">
                                <span className="small-padding-right">Selected file:</span>

                                <span className="pointer primary-text">{this.state.currentFile}</span>

                                <i className="material-icons delete-file-icon pointer"
                                   onClick={this.removeFile}>delete</i>
                            </div>
                            }

                        </div>

                    </div>


                    <input style={{display: "none"}} type="file" accept=".json" onChange={this.changeFileSelect}/>
                    <input type="password" placeholder="Passwort"/>
                    <div className="custom-select">
                        <select>
                            <option value="bloeckle">Blöckle</option>
                            <option value="kletterbox">Kletterbox</option>
                        </select>
                    </div>

                    <RoundButton type="secondary" class="upload-button"
                                 onClick={this.uploadFile}>Hochladen</RoundButton>
                </div>
            </div>

        </div>;
    }

}

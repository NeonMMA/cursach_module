import React, { Component } from "react";
import axios from 'axios';


class Upload extends Component  {
    state = {
        // Initially, no file is selected
        selectedFile: null,
    };

    // On file select (from the pop up)
    onFileChange = (event) => {

        const file = event.target.files[0];
        
        if (file && file.name.endsWith('.csv')) {
            this.setState({ selectedFile: file });
        } else {
            alert("Please select a valid CSV file.");
            event.target.value = null; 
        }
    };

    // On file upload (click the upload button)
    onFileUpload = () => {
        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        // Details of the uploaded file
        console.log(this.state.selectedFile);

        // Request made to the backend api
        // Send formData object
        // axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        axios.post("http://localhost:5000/upload", this.state.selectedFile);
    };

    render() {
        return (
            <div>
                <h1>GeeksforGeeks</h1>
                <h3>File Upload using React!</h3>
                <div>
                    <input
                        type="file"
                        onChange={this.onFileChange}
                        accept=".csv"
                    />
                    <button onClick={this.onFileUpload}>
                        Upload!
                    </button>
                </div>
            </div>
        );
    }
}

export default Upload;
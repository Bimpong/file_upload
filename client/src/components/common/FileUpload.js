import React, { Component } from "react";
import { axios } from "axios";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null
    };
  }

  handleUploadFile = event => {
    console.log(event.target.files[0]);
    const data = new FormData();
    data.append("file", event.target.files[0]);
    axios.post("/api/files", data).then(response => {
      console.log(response.data);
    });
  };

  render() {
    return (
      <div>
        <img width="320px" src={this.state.imageUrl} />
        <div>
          <input type="file" onChange={this.handleUploadFile} />
        </div>
      </div>
    );
  }
}

export default FileUpload;

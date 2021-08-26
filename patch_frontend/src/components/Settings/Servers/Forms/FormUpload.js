import React from "react";
import { Button, Form } from "reactstrap";
import { useState } from "react";
import { URLs, Cookies } from "../../../Urls";
import Axios from "axios";
import { useForm } from "react-hook-form";

export default function UploadForm(props) {
  const { register, handleSubmit } = useForm();

  const [file, setFile] = useState();

  const readCSVFile = (e) => {
    setFile(e.target.files[0]);
  };

  const submitFormUpload = (data) => {
    // console.log(data);
    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": Cookies("csrftoken"),
      },
    };
    let formData = new FormData();
    formData.append("serverUpload", file);
    formData.append("server_overwrite", data.server_overwrite);
    Axios.post(URLs().ServersUpload, formData, config)
      .then((res) => {
        // setValues(res.data);
        // console.log(res.data);
        props.updateErrorState(res.data.messages);
        props.addItemToState(res.data.Insert);
        props.updateState(res.data.Update);
      })
      .catch((error) => {
        // console.log(error);
        props.updateErrorState(error.toString());
      });
    props.toggle();
  };
  return (
    <>
      <Form onSubmit={handleSubmit(submitFormUpload)}>
        <div className="card box-popform-shadow">
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="form-group">
                <div className="custom-control custom-switch ml-3">
                  <input
                    type="checkbox"
                    name="server_overwrite"
                    className="custom-control-input"
                    id="server_overwrite"
                    ref={register}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="server_overwrite"
                  >
                    Overwrite the existing Servers
                  </label>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group">
                <div className="filediv btn btn-medium btn-theme ml-3">
                  <i className="fas fa-file-import"></i>&nbsp;Import File
                  <input
                    id="serverUpload"
                    name="serverUpload"
                    type="file"
                    accept=".csv"
                    className="filebtn"
                    ref={register}
                    onChange={(e) => readCSVFile(e)}
                  />
                </div>
                <label htmlFor="file">Import CSV Server List</label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="float-right">
            <Button className="btn btn-medium btn-theme">
              <i className="fas fa-chevron-up"></i>&nbsp;Upload
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}

import React, { useState } from "react";
import { Button, Form } from "reactstrap";
import { URLs, Cookies } from "../../../Urls";
import Axios from "axios";
import { useForm } from "react-hook-form";

export default function TechAdd(props) {
  const { register, handleSubmit } = useForm();
  const [technId, setTechId] = useState(null);
  const submitFormTechnology = (data) => {
    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": Cookies("csrftoken"),
      },
    };
    let formData = new FormData();
    formData.append("technology_id", technId.name);
    formData.append("technology_name", data.technology_name);
    formData.append("file_upload", technId);
    // console.log(data);
    Axios.post(URLs().TechnologyConfig + "add/", formData, config)
      .then((res) => {
        // console.log(res.data);
        if (res.data.status) {
          props.updateInfoState(res.data.data);
        } else {
          props.updateErrorState(res.data.data);
        }
      })
      .catch((error) => {
        // console.log(error);
        props.updateErrorState(error.toString());
      });
    props.toggle();
  };

  return (
    <>
      <Form onSubmit={handleSubmit(submitFormTechnology)}>
        <div className="row mt-3">
          <div className="col-md-8">
            <div className="form-group ml-2">
              <input
                type="text"
                name="technology_id"
                placeholder="Technology ID"
                className="form-control"
                ref={register}
                readOnly
                defaultValue={technId && technId.name}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mr-2 float-right">
              <div className="filediv btn btn-medium btn-theme">
                <i className="fas fa-file-import"></i>&nbsp;Import
                <input
                  id="file_upload"
                  name="file_upload"
                  type="file"
                  accept=".yml"
                  className="filebtn"
                  required
                  ref={register}
                  onChange={(e) => setTechId(e.target.files[0])}
                />
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group mr-2 ml-2">
              <input
                type="text"
                name="technology_name"
                placeholder="Technology Name"
                className="form-control"
                ref={register}
                required
              />
            </div>
          </div>
        </div>
        <div className="float-right mb-2 mr-2">
          <Button className="btn btn-medium btn-theme">
            <i className="fas fa-chevron-down"></i>&nbsp;Submit
          </Button>
        </div>
      </Form>
    </>
  );
}

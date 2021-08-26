import React, { useState, useEffect } from "react";
import { Button, Form } from "reactstrap";
import { useSeverity, useTechnologyUnique } from "../../Scheduler";
import { URLs, Cookies } from "../../../Urls";
import Axios from "axios";
import { useForm } from "react-hook-form";

function AddEditForm(props) {
  const { register, handleSubmit, setValue } = useForm();
  const rating = useSeverity();
  const techlist = useTechnologyUnique();

  const submitFormAdd = (data) => {
    Axios.defaults.headers.common = {
      "X-CSRFToken": Cookies("csrftoken"),
    };
    Axios.post(URLs().Patch, data)
      .then((res) => {
        props.addItemToState(res.data);
      })
      .catch((error) => {
        // console.log(error);
        // console.log(error.response.data[key]);
        props.updateErrorState(error.toString());
      });
    props.toggle();
  };

  const submitFormEdit = (data) => {
    try {
      Axios.defaults.headers.common = {
        "X-CSRFToken": Cookies("csrftoken"),
      };
      Axios.patch(URLs().Patch + data.patch_id + "/", data).then((res) => {
        props.updateState(res.data);
      });
    } catch (error) {
      // console.log(error.response.data[key]);
      props.updateErrorState(error.toString());
    }
    props.toggle();
  };

  const [state, setState] = useState({
    technology_id: "",
    severity: "",
  });

  useEffect(() => {
    if (props.comment) {
      setState({
        technology_id: props.comment.technology_id,
        severity: props.comment.severity,
      });
      setValue("patch_id", props.comment.patch_id);
      setValue("patch_name", props.comment.patch_name);
      setValue("technology_id", props.comment.technology_id);
      setValue("severity", props.comment.severity);
      setValue("release_date", props.comment.release_date);
    }
  }, [setValue, props.comment]);

  return (
    <Form
      onSubmit={
        props.comment
          ? handleSubmit(submitFormEdit)
          : handleSubmit(submitFormAdd)
      }
    >
      <div className="card">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              <label htmlFor="patch_id">Patch ID</label>
              {props.comment ? (
                <input
                  type="text"
                  name="patch_id"
                  className="form-control"
                  placeholder="Patch ID"
                  readOnly
                  ref={register}
                />
              ) : (
                <input
                  type="text"
                  name="patch_id"
                  className="form-control"
                  placeholder="Patch ID"
                  ref={register}
                />
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              <label htmlFor="patch_name">Patch Name</label>
              <input
                type="text"
                name="patch_name"
                className="form-control"
                placeholder="Patch Name"
                required
                ref={register}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group ml-2 mr-2">
              <select
                className="form-control"
                id="technology_id"
                name="technology_id"
                placeholder="Technology"
                required
                ref={register}
                value={state.technology_id}
                onChange={setState}
              >
                <option value="">Technology</option>
                {techlist.map((tech, index) => (
                  <option key={index} value={tech.technology_id}>
                    {tech.technology_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              {/* <label htmlFor="severity">Severity Rating</label> */}
              <select
                name="severity"
                className="form-control"
                required
                id="severity"
                value={state.severity}
                onChange={setState}
                ref={register}
              >
                <option value="">Severity Rating</option>
                {rating.map((z, index) => (
                  <option key={index} value={z.severity}>
                    {z.severity}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              {/* <label htmlFor="release_date">Release Date</label> */}
              <input
                type="date"
                name="release_date"
                className="form-control"
                placeholder="Release Date"
                required
                ref={register}
              />
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="float-right mb-2">
            <Button className="btn btn-medium btn-theme">
              <i
                className={
                  props.comment ? "fas fa-chevron-right" : "fas fa-chevron-down"
                }
              ></i>
              &nbsp;
              {props.comment ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}

export default AddEditForm;

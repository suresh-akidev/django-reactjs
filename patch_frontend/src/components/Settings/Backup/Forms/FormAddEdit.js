import React from "react";
import { Button, Form } from "reactstrap";
import { useGlobal } from "./../../Settings";
import { URLs, Cookies } from "../../../Urls";
import Axios from "axios";
import { useForm } from "react-hook-form";

function AddEditForm(props) {
  const { register, handleSubmit } = useForm();
  const global = useGlobal();

  const submitFormAdd = (data) => {
    Axios.defaults.headers.common = {
      "X-CSRFToken": Cookies("csrftoken"),
    };
    Axios.post(URLs().Backup, data)
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
      Axios.patch(URLs().Backup + data.backup_server + "/", data)
        .then((res) => {
          props.updateState(res.data);
        })
        .catch((error) => {
          props.updateErrorState(error.toString());
        });
    } catch (error) {
      // console.log(error.response.data[key]);
      props.updateErrorState(error.toString());
    }
    props.toggle();
  };

  return (
    <Form
      onSubmit={
        props.comment
          ? handleSubmit(submitFormEdit)
          : handleSubmit(submitFormAdd)
      }
    >
      <div className="card box-popform-shadow">
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="form-group ml-2 mr-2">
              <label htmlFor="account_name">Account Name</label>
              <select
                name="account_name"
                className="form-control"
                placeholder="Account Name"
                required
                id="account_name"
                ref={register}
              >
                {global.map((glob, index) => (
                  <option key={index} value={glob.account_name}>
                    {glob.account_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              <label htmlFor="backup_server">Backup Server Name</label>
              {props.comment ? (
                <input
                  type="text"
                  name="backup_server"
                  className="form-control"
                  placeholder="Server Name"
                  readOnly
                  id="backup_server"
                  defaultValue={
                    props.comment ? props.comment.backup_server : ""
                  }
                  ref={register}
                />
              ) : (
                <input
                  type="text"
                  name="backup_server"
                  className="form-control"
                  placeholder="Server Name"
                  required
                  id="backup_server"
                  defaultValue={
                    props.comment ? props.comment.backup_server : ""
                  }
                  ref={register}
                />
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              <label htmlFor="server_ip">Backup Server IP</label>
              <input
                type="text"
                name="server_ip"
                className="form-control"
                placeholder="Server IP"
                required
                id="server_ip"
                defaultValue={props.comment ? props.comment.server_ip : ""}
                ref={register}
              />
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group ml-2 mr-2">
              <label htmlFor="backup_url">Backup URL</label>
              <input
                type="text"
                name="backup_url"
                className="form-control"
                placeholder="Backup URL"
                required
                id="backup_url"
                defaultValue={props.comment ? props.comment.backup_url : ""}
                ref={register}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <div className="float-right">
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
    </Form>
  );
}

export default AddEditForm;

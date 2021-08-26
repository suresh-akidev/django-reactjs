import React, { useState, useEffect } from "react";
import { Button, Form } from "reactstrap";
import { useBackup, useMonitor, useCriticality } from "../../Settings";
import { useTechnology } from "../../../Scheduler/Scheduler";
import { URLs, Cookies } from "../../../Urls";
import Axios from "axios";
import { useForm } from "react-hook-form";

function AddEditForm(props) {
  const { register, handleSubmit, setValue } = useForm();

  const backup = useBackup();
  const monitor = useMonitor();
  const critical = useCriticality();
  const tech = useTechnology();

  const submitFormAdd = (data) => {
    Axios.defaults.headers.common = {
      "X-CSRFToken": Cookies("csrftoken"),
    };
    Axios.post(URLs().Servers, data)
      .then((res) => {
        props.addItemToState(res.data);
      })
      .catch((error) => {
        props.updateErrorState(error.toString());
      });
    props.toggle();
  };

  const submitFormEdit = (data) => {
    try {
      Axios.defaults.headers.common = {
        "X-CSRFToken": Cookies("csrftoken"),
      };
      Axios.patch(URLs().Servers + data.server_name + "/", data)
        .then((res) => {
          props.updateState(res.data);
        })
        .catch((error) => {
          props.updateErrorState(error.toString());
        });
    } catch (error) {
      props.updateErrorState(error.toString());
    }
    props.toggle();
  };

  const [state, setState] = useState({
    os_name: "",
    criticality: "",
    backup_server: "",
    monitor_server: "",
  });

  useEffect(() => {
    if (props.comment) {
      setState({
        os_name: props.comment.os_name,
        criticality: props.comment.criticality,
        backup_server: props.comment.backup_server,
        monitor_server: props.comment.monitor_server,
      });
      setValue("server_name", props.comment.server_name);
      setValue("ip_address", props.comment.ip_address);
      setValue("os_name", props.comment.os_name);
      setValue("credential_path", props.comment.credential_path);
      setValue("criticality", props.comment.criticality);
      setValue("backup_server", props.comment.backup_server);
      setValue("backup_enabled", props.comment.backup_enabled);
      setValue("monitor_server", props.comment.monitor_server);
      setValue("monitor_enabled", props.comment.monitor_enabled);
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
      <div className="card box-popform-shadow">
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              <input
                type="text"
                name="server_name"
                className="form-control"
                placeholder="Server Name"
                required
                ref={register}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              <input
                type="text"
                name="ip_address"
                className="form-control"
                placeholder="IP-Address"
                required
                ref={register}
              />
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group ml-2 mr-2">
              <select
                name="os_name"
                className="form-control"
                required
                value={state.os_name}
                onChange={setState}
                ref={register}
              >
                <option value="">Technology Name</option>
                {tech.map((d, index) => (
                  <option key={index} value={d.technology_name}>
                    {d.technology_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              <input
                type="text"
                name="credential_path"
                className="form-control"
                placeholder="Credential Path"
                required
                ref={register}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              <select
                name="criticality"
                className="form-control"
                required
                value={state.criticality}
                onChange={setState}
                ref={register}
              >
                <option value="">Criticality</option>
                {critical.map((cri, index) => (
                  <option key={index} value={cri.criticality}>
                    {cri.criticality}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              <select
                name="backup_server"
                className="form-control"
                required
                value={state.backup_server}
                onChange={setState}
                ref={register}
              >
                <option value="">Backup</option>
                {backup.map((bk, index) => (
                  <option key={index} value={bk.backup_server}>
                    {bk.backup_server}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              <div className="custom-control custom-switch">
                <input
                  type="checkbox"
                  name="backup_enabled"
                  className="custom-control-input"
                  id="backup_enabled"
                  ref={register}
                />
                <label
                  className="custom-control-label"
                  htmlFor="backup_enabled"
                >
                  BackupEnable Status
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              <select
                name="monitor_server"
                className="form-control"
                required
                value={state.monitor_server}
                onChange={setState}
                ref={register}
              >
                <option value="">Monitoring</option>
                {monitor.map((mo, index) => (
                  <option key={index} value={mo.monitor_server}>
                    {mo.monitor_server}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group ml-2 mr-2">
              <div className="custom-control custom-switch">
                <input
                  type="checkbox"
                  name="monitor_enabled"
                  className="custom-control-input"
                  id="monitor_enabled"
                  ref={register}
                />
                <label
                  className="custom-control-label"
                  htmlFor="monitor_enabled"
                >
                  MonitoringEnable Status
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <div className="float-right">
          {props.comment ? (
            <Button className="btn btn-medium btn-theme">
              <i className="fas fa-chevron-right"></i>&nbsp;Update
            </Button>
          ) : (
            <Button className="btn btn-medium btn-theme">
              <i className="fas fa-chevron-down"></i>&nbsp;Submit
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
}

export default AddEditForm;

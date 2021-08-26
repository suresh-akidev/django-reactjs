import React from "react";
import { Button, Form } from "reactstrap";
import { URLs, Cookies } from "../../../Urls";
import Axios from "axios";
import { useForm } from "react-hook-form";
import { useServerGroupTechnology } from "../../Settings";
import { useTechnology } from "../../../Scheduler/Scheduler";

export default function BulkForm(props) {
  const { register, handleSubmit } = useForm();
  const b_tech = useServerGroupTechnology();
  const tech = useTechnology();

  const submitFormBulk = (data) => {
    Axios.defaults.headers.common = {
      "X-CSRFToken": Cookies("csrftoken"),
    };
    // console.log(data);
    Axios.post(URLs().ServerGroupTechnology, data)
      .then((res) => {
        // console.log(res.data);
        props.updateInfoState(res.data);
      })
      .catch((error) => {
        // console.log(error);
        props.updateErrorState(error.toString());
      });
    props.toggle();
  };
  return (
    <>
      <Form onSubmit={handleSubmit(submitFormBulk)}>
        <div className="card box-popform-shadow">
          <div className="row">
            <div className="col-md-12 mt-2">
              <div className="form-group mr-2 ml-2">
                <select
                  name="os_name"
                  className="form-control"
                  required
                  ref={register}
                >
                  <option value="">[Technology Name from Server]</option>
                  {b_tech.map((d, index) => (
                    <option key={index} value={d.os_name}>
                      {d.os_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group text-center">
                <i className="fas fa-angle-double-down"></i>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group mr-2 ml-2">
                <select
                  name="technology_name"
                  className="form-control"
                  required
                  ref={register}
                >
                  <option value="">[Technology Name from Config]</option>
                  {tech.map((d, index) => (
                    <option key={index} value={d.technology_name}>
                      {d.technology_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="float-right">
            <Button className="btn btn-medium btn-theme">
              <i className="fas fa-check-double"></i>&nbsp;Update
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}

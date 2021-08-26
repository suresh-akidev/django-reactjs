import React from "react";
import { Button, Form } from "reactstrap";
import { URLs, Cookies } from "../../../Urls";
import Axios from "axios";
import { useForm } from "react-hook-form";
import { useTechnology } from "../../../Scheduler/Scheduler";

export default function TechEdit(props) {
  const { register, handleSubmit } = useForm();
  const tech = useTechnology();

  const submitFormTechnology = (data) => {
    Axios.defaults.headers.common = {
      "X-CSRFToken": Cookies("csrftoken"),
    };
    // console.log(data);
    Axios.post(URLs().TechnologyConfig + "edit/", data)
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
          <div className="col-md-12">
            <div className="form-group mr-2 ml-2">
              <select
                name="id"
                className="form-control"
                required
                ref={register}
              >
                <option value="">--Technology Name--</option>
                {tech.map((d, index) => (
                  <option key={index} value={d.id}>
                    {d.technology_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group mr-2 ml-2">
              <input
                type="text"
                name="technology_name"
                placeholder="Technology New Name"
                className="form-control"
                ref={register}
                required
              />
            </div>
          </div>
        </div>
        <div className="float-right mb-2 mr-2">
          <Button className="btn btn-medium btn-theme">
            <i className="fas fa-chevron-right"></i>&nbsp;Update
          </Button>
        </div>
      </Form>
    </>
  );
}

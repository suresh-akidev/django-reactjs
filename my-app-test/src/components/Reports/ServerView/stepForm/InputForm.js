import React, { useState } from "react";
import { useTechnology } from "../../../Scheduler/Scheduler";
import Notification from "../../../Notification";

export const InputForm = ({ formData, setForm, navigation }) => {
  const { technology, from_date, to_date } = formData;
  const [isError, setError] = useState("");

  const tech = useTechnology();

  const onCallClick = function () {
    if (from_date === "") {
      setError("Provide the From-Date");
    } else if (to_date === "") {
      setError("Provide the To-Date");
    } else {
      navigation.next();
    }
  };
  return (
    <>
      <div>
        <section className="contact-from pt-4">
          <div className="container">
            <div className="row mt-3">
              <div className="col-md-7 mx-auto">
                <div className="form-wrapper box-form-shadow">
                  <div className="row ">
                    <div className="col-md-12">
                      <h4>Server View</h4>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="technology">Technology Name</label>
                        <select
                          name="technology"
                          className="form-control"
                          placeholder="Technology Name"
                          required
                          value={technology}
                          onChange={setForm}
                        >
                          <option value="%">All</option>
                          {tech.map((d, index) => (
                            <option key={index} value={d.technology_name}>
                              {d.technology_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="from_date">From Date</label>
                        <input
                          type="date"
                          name="from_date"
                          className="form-control"
                          placeholder="Release Date"
                          required
                          value={from_date}
                          onChange={setForm}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="to_date">To Date</label>
                        <input
                          type="date"
                          name="to_date"
                          className="form-control"
                          placeholder="Release Date"
                          required
                          value={to_date}
                          onChange={setForm}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 float-right">
                    <button
                      className="btn btn-medium btn-theme"
                      onClick={() => onCallClick()}
                    >
                      <i className="fas fa-asterisk fa-spin"></i>
                      &nbsp;View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Notification
          isError={isError}
          isInfo={""}
          class_name="col-md-7 mx-auto"
        />
      </div>
    </>
  );
};

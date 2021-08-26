import React, { useState, useEffect } from "react";
import { URLs, Cookies } from "./../../../Urls";
import Axios from "axios";
import { useTechnologyUnique } from "../../Scheduler";
import PageLoader from "../../../FullPageLoader";
import Notification from "../../../Notification";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";

export const Jobs = ({ formData, setForm, navigation }) => {
  const techlist = useTechnologyUnique();
  const { promiseInProgress } = usePromiseTracker();
  const [isInfo, setInfo] = useState("");
  const [isError, setError] = useState("");
  const {
    ItsmAPI,
    change_no,
    planned_startdate,
    planned_enddate,
    actual_startdate,
    actual_enddate,
    technology_id,
  } = formData;

  useEffect(() => {
    const fetchData = async () => {
      if (formData.ItsmAPI) {
        try {
          Axios.defaults.headers.common = {
            "X-CSRFToken": Cookies("csrftoken"),
          };
          const res = await Axios.get(
            URLs().ChangeApprove + formData.change_no + "/"
          );
          if (res.data.change === "approved") {
            setInfo("Change has been approved");
          } else {
            setError("Change is " + res.data.change);
          }
        } catch (error) {
          // console.log(error.toString());
          setError(error.toString());
        }
      } else {
        setInfo("Change approval must be checked manually");
      }
    };
    trackPromise(fetchData());
  }, [formData]);

  const onCallClick = function () {
    if (
      isInfo === "Change has been approved" ||
      isInfo === "Change approval must be checked manually"
    ) {
      if (planned_startdate >= planned_enddate) {
        setError("Planned Start Date should be less than End date");
      } else if (actual_startdate >= actual_enddate) {
        setError("Actual Start Date should be less than End date");
      } else if (technology_id === "") {
        setError("Select the Technology");
      } else {
        navigation.next();
      }
    } else {
      setError("Change is not approved to schedule the task");
    }
  };
  return (
    <>
      {promiseInProgress && <PageLoader />}
      <div>
        <section className="contact-from">
          <div className="container">
            <div className="row mt-5">
              <div className="col-md-7 mx-auto">
                <div className="form-wrapper box-form-shadow">
                  <div className="row ">
                    <div className="col-md-12">
                      <h4>New Patch Job Schedule Form</h4>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="planned_startdate">
                          Valid Change No.
                        </label>
                        <input
                          type="text"
                          className="form-control form-read-only"
                          placeholder="Valid Ticket No."
                          // aria-label="Valid Ticket No."
                          // id="change_no"
                          name="change_no"
                          defaultValue={change_no}
                          disabled
                        />
                      </div>
                    </div>
                    {ItsmAPI ? (
                      <>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="planned_startdate">
                              Planned Start Date
                            </label>
                            <input
                              type="datetime-local"
                              name="planned_startdate"
                              className="form-control form-read-only"
                              disabled
                              defaultValue={planned_startdate}
                              // onChange={setForm}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="planned_enddate">
                              Planned End Date
                            </label>
                            <input
                              type="datetime-local"
                              name="planned_enddate"
                              className="form-control form-read-only"
                              disabled
                              defaultValue={planned_enddate}
                              // onChange={setForm}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="actual_startdate">
                              Actual Start Date
                            </label>
                            <input
                              type="datetime-local"
                              name="actual_startdate"
                              className="form-control"
                              required
                              value={actual_startdate}
                              onChange={setForm}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="actual_enddate">
                              Actual End Date
                            </label>
                            <input
                              type="datetime-local"
                              name="actual_enddate"
                              className="form-control form-read-only"
                              disabled
                              defaultValue={actual_enddate}
                              // onChange={setForm}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="planned_startdate">
                              Planned Start Date
                            </label>
                            <input
                              type="datetime-local"
                              name="planned_startdate"
                              className="form-control"
                              // required
                              value={planned_startdate}
                              onChange={setForm}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="planned_enddate">
                              Planned End Date
                            </label>
                            <input
                              type="datetime-local"
                              name="planned_enddate"
                              className="form-control"
                              // required
                              value={planned_enddate}
                              onChange={setForm}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="actual_startdate">
                              Actual Start Date
                            </label>
                            <input
                              type="datetime-local"
                              name="actual_startdate"
                              className="form-control"
                              // required
                              value={actual_startdate}
                              onChange={setForm}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="actual_enddate">
                              Actual End Date
                            </label>
                            <input
                              type="datetime-local"
                              name="actual_enddate"
                              className="form-control"
                              // required
                              value={actual_enddate}
                              onChange={setForm}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="col-md-12">
                      <div className="form-group">
                        <select
                          className="form-control"
                          id="technology_id"
                          name="technology_id"
                          placeholder="Technology"
                          // required
                          value={technology_id}
                          onChange={setForm}
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
                  </div>
                  <div className="mt-3 float-right">
                    <button
                      className="btn btn-medium btn-theme mr-4"
                      onClick={() => navigation.previous()}
                    >
                      <i className="fas fa-chevron-left"></i>
                      &nbsp;Back
                    </button>
                    <button
                      className="btn btn-medium btn-theme"
                      onClick={() => onCallClick()}
                    >
                      <i className="fas fa-chevron-right"></i>&nbsp;Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Notification
          isError={isError}
          isInfo={isInfo}
          class_name="col-md-7 mx-auto mb-5"
        />
      </div>
    </>
  );
};

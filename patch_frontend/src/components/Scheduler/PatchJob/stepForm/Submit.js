import React, { useState, useEffect } from "react";
import { Accordion, Card, Alert } from "react-bootstrap";
import Axios from "axios";
import { URLs, Cookies } from "./../../../Urls";
import PageLoader from "../../../FullPageLoader";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Notification from "../../../Notification";
export const Submit = ({ formData }) => {
  // console.log("Submit");
  // console.log(formData);
  const [isError, setError] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [config, setConfig] = useState([]);
  const [summary, setSummary] = useState([]);
  const { promiseInProgress } = usePromiseTracker();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let configHeader = {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies("csrftoken"),
          },
        };
        const res = await Axios.post(URLs().Scheduler, formData, configHeader);
        // console.log(res.data);
        // const myData = res.data;
        setSchedule(res.data.schedule);
        setConfig(res.data.config);
        setSummary(res.data.summaries);
      } catch (error) {
        // setError(error);
        // console.log(error.toString());
        setError(error.toString());
      }
    };
    trackPromise(fetchData());
  }, [formData]);

  return (
    <>
      {promiseInProgress && <PageLoader />}
      <Notification
        isError={isError}
        isInfo={""}
        class_name="float-left col-md-7"
      />
      <div className="container">
        {schedule.job_id === parseInt(schedule.job_id, 10) ? (
          <Alert variant="success">Job has been created successfully</Alert>
        ) : (
          <Alert variant="danger">Job has not been created</Alert>
        )}

        <h3>Scheduler & Config Report</h3>
        <RenderAccordion
          summary="Jobs"
          title="Job Scheduler"
          details={schedule}
        />
        <RenderAccordion
          summary="Config"
          title="Configuration"
          details={config}
        />
        <RenderAccordion
          summary="Servers"
          title="Selected Servers"
          details={summary}
        />
      </div>
    </>
  );
};

export const RenderAccordion = ({ summary, title, details }) => (
  <>
    <Accordion defaultActiveKey="Jobs">
      <Card className="box-popform-shadow">
        <Card.Header>
          <Accordion.Toggle as={Card.Header} eventKey={summary}>
            {title}
          </Accordion.Toggle>
        </Card.Header>
        {summary === "Jobs" ? (
          <Accordion.Collapse eventKey={summary}>
            <Card.Body>
              <table className="table">
                <tr>
                  <td>
                    {details.job_id === parseInt(details.job_id, 10)
                      ? "Job Id :" + details.job_id
                      : details.job_id}
                  </td>
                </tr>
                <tr>
                  <td>{details.schedule}</td>
                </tr>
              </table>
            </Card.Body>
          </Accordion.Collapse>
        ) : (
          ""
        )}
        {summary === "Config" ? (
          <Accordion.Collapse eventKey={summary}>
            <Card.Body>
              <table className="table">
                <tr>
                  <td>{details}</td>
                </tr>
              </table>
            </Card.Body>
          </Accordion.Collapse>
        ) : (
          ""
        )}
        {summary === "Servers" ? (
          <Accordion.Collapse eventKey={summary}>
            <Card.Body>
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Server Name</th>
                      {/* <th scope="col">Summary ID</th> */}
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{data.server_name}</td>
                          {/* <td>{data.summaries}</td> */}
                          <td
                            className={
                              data.summaries === "-1"
                                ? "text-danger"
                                : "text-primary"
                            }
                          >
                            {data.status}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        ) : (
          ""
        )}
      </Card>
    </Accordion>
  </>
);

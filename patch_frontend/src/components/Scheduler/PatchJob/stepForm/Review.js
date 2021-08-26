import React from "react";
import { Accordion, Card } from "react-bootstrap";
// import Notification from "../../../Notification";
import { UnControlled as CodeMirror } from "react-codemirror2";
require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");

require("codemirror/mode/yaml/yaml.js");
require("codemirror/mode/javascript/javascript.js");

export const Review = ({ formData, navigation }) => {
  const { go } = navigation;

  return (
    <div className="container">
      <h3>Review</h3>
      <RenderAccordion
        summary="Jobs"
        title="Job Scheduler"
        go={go}
        details={formData}
      />
      <RenderAccordion
        summary="Config"
        title="Configuration"
        go={go}
        details={formData}
      />
      <RenderAccordion
        summary="Servers"
        title="Selected Servers"
        go={go}
        details={formData}
      />
      <div className="mt-3 float-right mb-5">
        <button
          className="btn btn-medium btn-theme"
          onClick={() => go("submit")}
        >
          <i className="fas fa-chevron-down"></i>&nbsp;Submit
        </button>
      </div>
    </div>
  );
};

export const RenderAccordion = ({ summary, title, details, go }) => (
  <>
    <Accordion>
      <Card className="box-popform-shadow">
        <Card.Header>
          <Accordion.Toggle as={Card.Header} eventKey={summary}>
            {title}
          </Accordion.Toggle>
        </Card.Header>
        {summary === "Jobs" ? (
          <Accordion.Collapse eventKey={summary}>
            <Card.Body>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Change No : </label> {details.change_no}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group"></div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Planned Start Date : </label>
                    {details.planned_startdate}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Planned End Date : </label>
                    {details.planned_enddate}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Actual Start Date : </label>
                    {details.actual_startdate}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Actual End Date : </label>
                    {details.actual_enddate}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label>Patch ID : </label> {details.patch_id}
                  </div>
                </div>
              </div>
              <div className="mt-3 float-right">
                <button
                  className="float-left buttonIcone"
                  onClick={() => go(`${summary}`)}
                >
                  <i className="fas fa-keyboard"></i>
                </button>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        ) : (
          ""
        )}
        {summary === "Config" ? (
          <Accordion.Collapse eventKey={summary}>
            <Card.Body>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Technology : </label> {details.technology_id}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group"></div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <CodeMirror
                      value={details.config_content}
                      options={{
                        mode: "yaml",
                        theme: "material",
                        lineNumbers: true,
                        readOnly: true,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 float-right">
                <button
                  className="float-left buttonIcone"
                  onClick={() => go(`${summary}`)}
                >
                  <i className="fas fa-keyboard"></i>
                </button>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        ) : (
          ""
        )}
        {summary === "Servers" ? (
          <Accordion.Collapse eventKey={summary}>
            <Card.Body>
              <div>
                {details.server_list.map((data, index) => {
                  return <li key={index}>{data}</li>;
                })}
                <div className="mt-3 float-right">
                  <button
                    className="float-left buttonIcone"
                    onClick={() => go(`${summary}`)}
                  >
                    <i className="fas fa-keyboard"></i>
                  </button>
                </div>
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

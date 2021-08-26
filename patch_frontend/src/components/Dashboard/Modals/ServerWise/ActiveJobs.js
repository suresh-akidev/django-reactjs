import React from "react";
import { Popover, OverlayTrigger } from "react-bootstrap";
import PropTypes from "prop-types";
import DataTable from "./DataTable";

export default function ActiveJobs(props) {
  const popover = (
    <Popover id="popover-basic" className="dashboardpop">
      <Popover.Title as="h3">ActiveJobs</Popover.Title>
      <Popover.Content>
        <div>
          <DataTable
            Type="ActiveJobs"
            pagination={true}
            dropData={props.dropData}
          />
        </div>
      </Popover.Content>
    </Popover>
  );
  return (
    <div className="col-lg-2 col-sm-6">
      <div className="card-stats card">
        <div className="card-body">
          <div className="row">
            <div className="col-4">
              <div className="text-center">
                <i className="fas fa-asterisk fa-pulse fa-2x text-info"></i>
              </div>
            </div>

            <div className="col-8">
              <div className="numbers">
                <h5 className="h4Server">ActiveJob</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer bg-info text-right">
          <h6 className="h4Black">
            <OverlayTrigger
              trigger={["click"]}
              placement="auto"
              overlay={popover}
              rootClose
            >
              <span className="handsCursor">
                {props.Scheduled
                  ? props.Running
                    ? props.Scheduled + props.Running
                    : props.Scheduled
                  : props.Running
                  ? props.Running
                  : 0}
              </span>
            </OverlayTrigger>
          </h6>
        </div>
      </div>
    </div>
  );
}
ActiveJobs.propTypes = {
  dropData: PropTypes.number,
  Type: PropTypes.string,
  pagination: PropTypes.bool,
};

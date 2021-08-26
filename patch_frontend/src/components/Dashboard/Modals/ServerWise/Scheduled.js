import React from "react";
import { Popover, OverlayTrigger } from "react-bootstrap";
import PropTypes from "prop-types";
import DataTable from "./DataTable";

export default function Scheduled(props) {
  const popover = (
    <Popover id="popover-basic" className="dashboardpop">
      <Popover.Title as="h3">Scheduled</Popover.Title>
      <Popover.Content>
        <div>
          <DataTable
            Type="Scheduled"
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
                <i className="fas fa-cog fa-spin fa-2x text-warning"></i>
              </div>
            </div>

            <div className="col-8">
              <div className="numbers">
                <h5 className="h4Server">Scheduled</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer bg-warning text-right">
          <h6 className="h4Black">
            <OverlayTrigger
              trigger={["click"]}
              placement="auto"
              overlay={popover}
              rootClose
            >
              <span className="handsCursor">
                {props.Scheduled ? props.Scheduled : 0}
              </span>
            </OverlayTrigger>
          </h6>
        </div>
      </div>
    </div>
  );
}
Scheduled.propTypes = {
  dropData: PropTypes.number,
  Type: PropTypes.string,
  pagination: PropTypes.bool,
};

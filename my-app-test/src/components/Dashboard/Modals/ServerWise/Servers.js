import React from "react";
import { Popover, OverlayTrigger } from "react-bootstrap";
import DataTable from "./DataTable";
import PropTypes from "prop-types";

export default function Servers(props) {
  // let ref = React.useRef(null);
  const popover = (
    <Popover id="popover-basic" className="dashboardpop">
      <Popover.Title as="h3">Servers</Popover.Title>
      <Popover.Content>
        <DataTable Type="Servers" pagination={true} dropData={0} />
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
                <i className="fas fa-server fa-2x text-primary"></i>
              </div>
            </div>

            <div className="col-8">
              <div className="numbers">
                <h5 className="h4Server">Servers</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer text-right bg-primary">
          <h6 className="h4White">
            <OverlayTrigger
              // ref={(r) => (ref = r)}
              // container={ref.current}
              trigger={["click"]}
              placement="auto"
              overlay={popover}
              rootClose
            >
              <span className="handsCursor">
                {props.Servers ? props.Servers : 0}
              </span>
            </OverlayTrigger>
          </h6>
        </div>
      </div>
    </div>
  );
}
Servers.propTypes = {
  Type: PropTypes.string,
  pagination: PropTypes.bool,
};

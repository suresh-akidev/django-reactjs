import React from "react";
import { Popover, OverlayTrigger } from "react-bootstrap";
import PropTypes from "prop-types";
import DataTable from "./DataTable";

export default function Failed(props) {
  const [show, setShow] = React.useState(false);
  const target = React.useRef(null);
  const popover = (
    <Popover id="popover-basic" className="dashboardpop">
      <Popover.Title as="h3">Failed</Popover.Title>
      <Popover.Content>
        <button
          type="button"
          className="close buttonIcone danger"
          aria-label="Close"
          ref={target}
          onClick={() => setShow(!show)}
        >
          <i className="fas fa-times-circle"></i>
        </button>
        <DataTable Type="Failed" pagination={true} dropData={props.dropData} />
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
                <i className="fas fa-calendar-times fa-2x text-danger"></i>
              </div>
            </div>
            <div className="col-8">
              <div className="numbers">
                <h5 className="h4Server">Failed</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer text-right bg-danger">
          <h6 className="h4White">
            <OverlayTrigger
              target={target.current}
              show={show}
              placement="auto"
              overlay={popover}
            >
              <span className="handsCursor" onClick={() => setShow(!show)}>
                {props.Failed ? props.Failed : 0}
              </span>
            </OverlayTrigger>
          </h6>
        </div>
      </div>
    </div>
  );
}
Failed.propTypes = {
  dropData: PropTypes.number,
  Type: PropTypes.string,
  pagination: PropTypes.bool,
};

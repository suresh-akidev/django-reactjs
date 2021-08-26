import React, { useState, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import PageLoader from "../FullPageLoader";

const SwitchCase = lazy(() => import("./Modals/SwitchCase"));
const ServerWise = lazy(() => import("./Modals/ServerWise"));
const Compliance = lazy(() => import("./Modals/Compliance"));
const TechChart = lazy(() => import("./Modals/TechChart"));
const UpComing = lazy(() => import("./Modals/UpComing"));
const Notification = lazy(() => import("../Notification"));

const Dashboard = () => {
  const [isError, setError] = useState("");
  const [dropData, setDropData] = useState(2);

  const onClickHandle = (mon) => {
    setDropData(Number(mon));
  };

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <div className="content">
          <div className="mb-2">
            <Nav variant="light" activeKey={dropData} onSelect={onClickHandle}>
              <NavDropdown
                title={
                  <>
                    <i className="fas fa-database fa-sm mr-2"></i>
                    <SwitchCase dropData={dropData} />
                  </>
                }
                id="nav-dropdown"
              >
                <NavDropdown.Item eventKey="1">
                  <i className="fas fa-database fa-sm mr-2"></i>Current Month
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="2">
                  <i className="fas fa-database fa-sm mr-2"></i>Last 2 Months
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="3">
                  <i className="fas fa-database fa-sm mr-2"></i>Last 3 Months
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="6">
                  <i className="fas fa-database fa-sm mr-2"></i>Last 6 Months
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="12">
                  <i className="fas fa-database fa-sm mr-2"></i>Last 12 Months
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>
          {/* **************************************************
           ********************** Row 1 ************************
           ***************************************************/}
          <div className="row">
            <ServerWise dropData={dropData} setError={setError} />
          </div>
          {isError === "" && (
            <>
              <div className="row">
                <TechChart />
                <Compliance />
              </div>

              <div className="row">
                <UpComing />
              </div>
            </>
          )}
          <Notification
            isError={isError}
            isInfo=""
            class_name="col-md-10 mx-auto"
          />
        </div>
      </Suspense>
    </>
  );
};

export default Dashboard;
Dashboard.propTypes = {
  dropData: PropTypes.number,
  setError: PropTypes.func,
};

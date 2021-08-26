import React, { Suspense, lazy } from "react";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
// import Dashboard from "./Dashboard";
// import Scheduler from "./Scheduler";
// import Settings from "./Settings";
// import Reports from "./Reports";
// import Analytics from "./Analytics";

import PageLoader from "./FullPageLoader";
const Dashboard = lazy(() => import("./Dashboard"));
const Scheduler = lazy(() => import("./Scheduler"));
const Settings = lazy(() => import("./Settings"));
const Reports = lazy(() => import("./Reports"));
const Analytics = lazy(() => import("./Analytics"));

const SideBar = () => {
  let selectedDefault =
    window.location.href.split("/")[4] === undefined
      ? "/dashboard"
      : window.location.href.split("/")[4] === ""
      ? "/dashboard"
      : window.location.href.split("/")[5] === undefined
      ? "/" + window.location.href.split("/")[4]
      : window.location.href.split("/")[4] === "settings"
      ? "/" + window.location.href.split("/")[4]
      : "/" +
        window.location.href.split("/")[4] +
        "/" +
        window.location.href.split("/")[5];
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route
            render={({ location, history }) => (
              <React.Fragment>
                <SideNav
                  onSelect={(selected) => {
                    const to = "/patches" + selected;
                    if (location.pathname !== to) {
                      history.push(to);
                    }
                  }}
                >
                  <SideNav.Toggle />
                  <SideNav.Nav defaultSelected={selectedDefault}>
                    <NavItem eventKey="/dashboard">
                      <NavIcon>
                        <i
                          className="fas fa-laptop-house"
                          style={{ fontSize: "1.75em" }}
                        />
                      </NavIcon>
                      <NavText>
                        <span className="sideNavText">Dashboard</span>
                      </NavText>
                    </NavItem>
                    <NavItem eventKey="/settings">
                      <NavIcon>
                        <i
                          className="fas fa-cogs"
                          style={{ fontSize: "1.75em" }}
                        />
                      </NavIcon>
                      <NavText>
                        <span className="sideNavText">Settings</span>
                      </NavText>
                    </NavItem>

                    <NavItem eventKey="/scheduler">
                      <NavIcon>
                        <i
                          className="fab fa-stack-overflow"
                          style={{ fontSize: "1.75em" }}
                        />
                      </NavIcon>
                      <NavText>
                        <span className="sideNavText">Scheduler</span>
                      </NavText>
                      <NavItem eventKey="/scheduler/patches">
                        <NavText>Patches</NavText>
                      </NavItem>
                      <NavItem eventKey="/scheduler/patchjob">
                        <NavText>Patch Job</NavText>
                      </NavItem>
                      <NavItem eventKey="/scheduler/activejob">
                        <NavText>Active Job</NavText>
                      </NavItem>
                    </NavItem>

                    <NavItem eventKey="/reports">
                      <NavIcon>
                        <i
                          className="fas fa-list-alt"
                          style={{ fontSize: "1.75em" }}
                        />
                      </NavIcon>
                      <NavText>
                        <span className="sideNavText">Reports</span>
                      </NavText>
                      <NavItem eventKey="/reports/jobview">
                        <NavText>Job View</NavText>
                      </NavItem>
                      <NavItem eventKey="/reports/serverview">
                        <NavText>Server View</NavText>
                      </NavItem>
                    </NavItem>

                    <NavItem eventKey="/analytics">
                      <NavIcon>
                        <i
                          className="fas fa-chart-pie"
                          style={{ fontSize: "1.75em" }}
                        />
                      </NavIcon>
                      <NavText>
                        <span className="sideNavText">Analytics</span>
                      </NavText>
                    </NavItem>
                  </SideNav.Nav>
                </SideNav>
                <main className="contentMain">
                  <div>
                    <Suspense fallback={<PageLoader />}>
                      <Route
                        path="/patches"
                        exact
                        component={(props) => <Dashboard />}
                      />

                      <Route
                        path="/patches/dashboard"
                        component={(props) => <Dashboard />}
                      />

                      <Route
                        path="/patches/settings"
                        component={(props) => <Settings />}
                      />

                      <Route
                        path="/patches/scheduler/patches"
                        component={(props) => <Scheduler />}
                      />
                      <Route
                        path="/patches/scheduler/patchjob"
                        component={(props) => <Scheduler />}
                      />
                      <Route
                        path="/patches/scheduler/activejob"
                        component={(props) => <Scheduler />}
                      />

                      <Route
                        path="/patches/reports/jobview"
                        component={(props) => <Reports />}
                      />
                      <Route
                        path="/patches/reports/serverview"
                        component={(props) => <Reports />}
                      />

                      <Route
                        path="/patches/analytics"
                        component={(props) => <Analytics />}
                      />
                    </Suspense>
                  </div>
                </main>
              </React.Fragment>
            )}
          />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default SideBar;

import React, { useState, lazy, Suspense } from "react";
import { Route, BrowserRouter, Switch, Link } from "react-router-dom";
import PageLoader from "../FullPageLoader";

// import JobView from "./JobView";
// import ServerView from "./ServerView";
const JobView = lazy(() => import("./JobView"));
const ServerView = lazy(() => import("./ServerView"));

const Reports = () => {
  const [activeIndex, setActiveIndex] = useState(
    window.location.href.indexOf("serverview") > -1 ? 1 : 0
  );

  const menu = [
    {
      id: 0,
      Name: "Job View",
      Path: "/patches/reports/jobview",
    },
    {
      id: 1,
      Name: "Server View",
      Path: "/patches/reports/serverview",
    },
    // {
    //   id: 2,
    //   Name: "Sample",
    //   Path: "/patches/reports/sample",
    // },
  ];

  const handleOnClick = (index) => {
    setActiveIndex(index); // remove the curly braces
  };
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route
            render={({ location, history }) => (
              <React.Fragment>
                <div className="tabs tabs-style-linetriangle">
                  <nav>
                    <ul>
                      {menu.map((m, index) => (
                        <li
                          key={index}
                          onClick={() => handleOnClick(m.id)}
                          className={activeIndex === m.id ? "tab-current" : " "}
                        >
                          <Link to={m.Path}>
                            <span>{m.Name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>

                <main>
                  <Suspense fallback={<PageLoader />}>
                    <div className="container">
                      <Route
                        path="/patches/reports"
                        exact
                        component={(props) => <JobView />}
                      />
                      <Route
                        path="/patches/reports/jobview"
                        component={(props) => <JobView />}
                      />

                      <Route
                        path="/patches/reports/serverview"
                        component={(props) => <ServerView />}
                      />

                      {/* <Route
                      path="/patches/reports/sample"
                      component={(props) => <Sample />}
                    /> */}
                    </div>
                  </Suspense>
                </main>
              </React.Fragment>
            )}
          />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default Reports;

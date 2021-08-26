import React, { useState, lazy, Suspense } from "react";
import { Route, BrowserRouter, Switch, Link } from "react-router-dom";
import PageLoader from "../FullPageLoader";
// import MonthView from "./MonthView";
// import ServerView from "./ServerView";
// import Sample from "./sample";

const MonthView = lazy(() => import("./MonthView"));

const Analytics = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const menu = [
    {
      id: 0,
      Name: "Month View",
      Path: "/patches/analytics/monthview",
    },
    // {
    //   id: 1,
    //   Name: "Server View",
    //   Path: "/patches/analytics/serverview",
    // },
    // {
    //   id: 2,
    //   Name: "Sample",
    //   Path: "/patches/analytics/sample",
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
              // <div
              //   onSelect={(selected) => {
              //     const to = "/setting" + selected;
              //     if (location.pathname !== to) {
              //       history.push(to);
              //     }
              //   }}
              // >
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
                        path="/patches/analytics"
                        exact
                        component={(props) => <MonthView />}
                      />
                      <Route
                        path="/patches/analytics/monthview"
                        component={(props) => <MonthView />}
                      />

                      {/* <Route
                      path="/patches/analytics/serverview"
                      component={(props) => <ServerView />}
                    />

                    <Route
                      path="/patches/analytics/sample"
                      component={(props) => <Sample />}
                    /> */}
                    </div>
                  </Suspense>
                </main>
              </React.Fragment>
              // </div>
            )}
          />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default Analytics;

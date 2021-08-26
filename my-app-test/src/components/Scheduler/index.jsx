import React, { useState, lazy, Suspense } from "react";
import { Route, BrowserRouter, Switch, Link } from "react-router-dom";
import PageLoader from "../FullPageLoader";

// import Patches from "./Patches";
// import PatchJob from "./PatchJob";
// import ActiveJob from "./ActiveJob";

const Patches = lazy(() => import("./Patches"));
const PatchJob = lazy(() => import("./PatchJob"));
const ActiveJob = lazy(() => import("./ActiveJob"));

const Scheduler = () => {
  const [activeIndex, setActiveIndex] = useState(
    window.location.href.indexOf("activejob") > -1
      ? 2
      : window.location.href.indexOf("patchjob") > -1
      ? 1
      : 0
  );

  const menu = [
    {
      id: 0,
      Name: "Patches",
      Path: "/patches/scheduler/patches",
    },
    {
      id: 1,
      Name: "Patch Job",
      Path: "/patches/scheduler/patchjob",
    },
    {
      id: 2,
      Name: "Active Job",
      Path: "/patches/scheduler/activejob",
    },
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
                        path="/patches/scheduler"
                        exact
                        component={(props) => <Patches />}
                      />
                      <Route
                        path="/patches/scheduler/patches"
                        component={(props) => <Patches />}
                      />

                      <Route
                        path="/patches/scheduler/patchJob"
                        component={(props) => <PatchJob />}
                      />

                      <Route
                        path="/patches/scheduler/activejob"
                        component={(props) => <ActiveJob />}
                      />
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

export default Scheduler;

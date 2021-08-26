import React, { useState, useEffect, lazy, Suspense } from "react";
import { Route, BrowserRouter, Switch, Link } from "react-router-dom";

import { URLs, Cookies } from "./../Urls";
import Axios from "axios";
import PageLoader from "../FullPageLoader";

const Global = lazy(() => import("./Global"));
const Backup = lazy(() => import("./Backup"));
const Monitor = lazy(() => import("./Monitor"));
const Servers = lazy(() => import("./Servers"));

export default function Setting() {
  const [activeIndex, setActiveIndex] = useState(
    window.location.href.indexOf("servers") > -1
      ? 3
      : window.location.href.indexOf("backup") > -1
      ? 1
      : window.location.href.indexOf("monitor") > -1
      ? 2
      : 0
  );
  const [classItem, setClassItem] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().MenuActive);
        // console.log(result.data);
        setClassItem(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const addMenuToState = (Item) => {
    setClassItem(Item);
  };

  const menu = [
    {
      id: 0,
      Name: "GlobalConfig",
      Path: "/patches/settings/global",
    },
    {
      id: 1,
      Name: "BackupServer",
      Path: "/patches/settings/backup",
    },
    {
      id: 2,
      Name: "MonitorServer",
      Path: "/patches/settings/monitor",
    },
    {
      id: 3,
      Name: "Servers",
      Path: "/patches/settings/servers",
    },
  ];

  const handleOnClick = (index) => {
    if (index <= classItem) {
      setActiveIndex(index);
    } // remove the curly braces
  };
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route
            render={({ location, history }) => (
              <React.Fragment>
                <div className="tabs tabs-style-linetriangle container">
                  <nav>
                    <ul>
                      {menu.map((m, index) => (
                        <li
                          key={index}
                          onClick={() => handleOnClick(m.id)}
                          className={activeIndex === m.id ? "tab-current" : " "}
                        >
                          {m.id <= classItem ? (
                            <Link to={m.Path}>
                              <span>{m.Name}</span>
                            </Link>
                          ) : (
                            <a
                              href="#disabled"
                              className="sr-only-focusable disabled-a"
                            >
                              <span>{m.Name}</span>
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
                <main>
                  <Suspense fallback={<PageLoader />}>
                    <Route
                      path="/patches/settings"
                      exact
                      component={(props) => (
                        <Global addMenuToState={addMenuToState} />
                      )}
                    />
                    <Route
                      path="/patches/settings/global"
                      component={(props) => (
                        <Global addMenuToState={addMenuToState} />
                      )}
                    />
                    <Route
                      path="/patches/settings/backup"
                      component={(props) => (
                        <Backup addMenuToState={addMenuToState} />
                      )}
                    />
                    <Route
                      path="/patches/settings/monitor"
                      component={(props) => (
                        <Monitor addMenuToState={addMenuToState} />
                      )}
                    />
                    <Route
                      path="/patches/settings/servers"
                      component={(props) => <Servers />}
                    />
                  </Suspense>
                </main>
              </React.Fragment>
              //{" "}
            )}
          />
        </Switch>
      </BrowserRouter>
    </>
  );
}

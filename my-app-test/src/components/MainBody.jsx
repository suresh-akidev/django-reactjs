import React from "react";
import Dashboard from "./Dashboard";
import Scheduler from "./Scheduler";
import Setting from "./Setting";
import { Route } from "react-router-dom";

const MainBody = () => {
  return (
    <>
      <main>
        <Route path="/" exact component={(props) => <Dashboard />} />
        <Route path="/dashboard" component={(props) => <Dashboard />} />
        <Route path="/setting" component={(props) => <Setting />} />
        <Route path="/scheduler" component={(props) => <Scheduler />} />
      </main>
    </>
  );
};

export default MainBody;

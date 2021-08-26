import React from "react";
import Card from "react-bootstrap/Card";
import { RunningDash, ScheduledDash } from "../../../Notification/ReportsFlags";
import DataTable from "../../Modals/ServerWise/DataTable";

export default function UpComing() {
  return (
    <>
      <div className="col-lg-6 col-sm-6">
        <Card>
          <Card.Header>
            <span className="h4Black">Running Tasks</span>
            <div className="float-right">
              <RunningDash />
            </div>
          </Card.Header>
          <Card.Body>
            <DataTable Type="Running" pagination={false} dropData={0} />
          </Card.Body>
        </Card>
      </div>

      <div className="col-lg-6 col-sm-6">
        <Card>
          <Card.Header>
            <span className="h4Black">Up Coming Tasks</span>
            <div className="float-right">
              <ScheduledDash />
            </div>
          </Card.Header>
          <Card.Body>
            <DataTable Type="Scheduled" pagination={false} dropData={0} />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

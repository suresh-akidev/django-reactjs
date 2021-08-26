import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import Clone from "./TechClone";
import Edit from "./TechEdit";
import Add from "./TechAdd";

export default function TechnologyForm(props) {
  return (
    <>
      <div className="card box-popform-shadow">
        <Tabs fill defaultActiveKey="Clone">
          <Tab
            eventKey="Clone"
            title="Clone"
            mountOnEnter // <<<
            unmountOnExit={false}
          >
            <Clone
              updateInfoState={props.updateInfoState}
              updateErrorState={props.updateErrorState}
              toggle={props.toggle}
            />
          </Tab>
          <Tab
            eventKey="Edit"
            title="Edit"
            mountOnEnter // <<<
            unmountOnExit={false}
          >
            <Edit
              updateInfoState={props.updateInfoState}
              updateErrorState={props.updateErrorState}
              toggle={props.toggle}
            />
          </Tab>
          <Tab
            eventKey="Add"
            title="Add"
            mountOnEnter // <<<
            unmountOnExit={false}
          >
            <Add
              updateInfoState={props.updateInfoState}
              updateErrorState={props.updateErrorState}
              toggle={props.toggle}
            />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

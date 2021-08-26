import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
// import { Button } from "react-bootstrap";
import Axios from "axios";
import { URLs, Cookies } from "./../../../Urls";
import { useScheduled } from "../../Scheduler";
import { useState, useEffect } from "react";
import PageLoader from "../../../FullPageLoader";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Notification from "../../../Notification";

export const Servers = ({ formData, setForm, navigation }) => {
  const [server, setServer] = useState([]);
  const [isError, setError] = useState("");
  const { promiseInProgress } = usePromiseTracker();
  const [catagoryList, setCatagory] = useState([]);
  const unselectable = useScheduled();

  function onRowSelect({ server_name }, isSelected) {
    if (isSelected) {
      let val = [...server, server_name];
      setServer(val);
      formData.server_list = val;
    } else {
      let val = server.filter((it) => it !== server_name);
      setServer(val);
      formData.server_list = val;
    }
    return false;
  }

  function onSelectAll(isSelected) {
    if (!isSelected) {
      setServer([]);
      formData.server_list = [];
    }
    return false;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const res = await Axios.get(
          URLs().Servers + "technology/" + formData.technology_id + "/"
        );
        setCatagory(res.data);
        setServer(formData.server_list);
      } catch (error) {
        // console.log(error.toString());
        setError(error.toString());
      }
    };
    trackPromise(fetchData());
  }, [formData]);

  const onCallClick = function () {
    if (formData.server_list.length === 0) {
      setError("Select the servers from the list");
    } else {
      navigation.next();
    }
  };
  const createCustomShowSelectButton = (onClick, showSelected) => {
    return (
      <button className="btn btn-medium btn-theme" onClick={() => onClick()}>
        {showSelected ? (
          <>
            <i className="fas fa-check-double"></i>&nbsp;Show All
          </>
        ) : (
          <>
            <i className="fas fa-check"></i>&nbsp;Show Selected Only
          </>
        )}
      </button>
    );
  };
  const selectRowProp = {
    mode: "checkbox",
    bgColor: "#74777b",
    clickToSelect: true,
    onSelect: onRowSelect,
    onSelectAll: onSelectAll,
    // selected: state.selected
    selected: formData.server_list,
    showOnlySelected: true,
    unselectable: unselectable, // give rowkeys for unselectable row
  };
  const options = {
    page: 1,
    paginationSize: 3,
    paginationPosition: "bottom",
    hideSizePerPage: true,
    defaultSortName: "server_name", // default sort column name
    defaultSortOrder: "desc", // default sort order
    showSelectedOnlyBtn: createCustomShowSelectButton,
  };
  return (
    <>
      {promiseInProgress && <PageLoader />}
      <div className="datatablenew">
        <h4 className="h4Server text-center"> Server Details</h4>
        <BootstrapTable
          data={catagoryList}
          search={true}
          pagination={true}
          options={options}
          selectRow={selectRowProp}
          className="table-striped"
        >
          <TableHeaderColumn dataField="server_name" isKey dataSort>
            Server Name
          </TableHeaderColumn>
          <TableHeaderColumn dataField="ip_address" dataSort width={"12%"}>
            IP Addr
          </TableHeaderColumn>
          <TableHeaderColumn dataField="os_name" dataSort>
            OS Name
          </TableHeaderColumn>
          <TableHeaderColumn dataField="credential_path" dataSort>
            Credential Path
          </TableHeaderColumn>
          <TableHeaderColumn dataField="backup_server" dataSort>
            Backups
          </TableHeaderColumn>
          <TableHeaderColumn dataField="criticality" dataSort>
            Criticality
          </TableHeaderColumn>
          <TableHeaderColumn dataField="backup_enabled" dataSort width={"7%"}>
            Enabled
          </TableHeaderColumn>
          <TableHeaderColumn dataField="monitor_server" dataSort>
            Monitoring
          </TableHeaderColumn>
          <TableHeaderColumn dataField="monitor_enabled" dataSort width={"7%"}>
            Enabled
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
      <div className="mt-3 float-right">
        <button
          className="btn btn-medium btn-theme mr-4"
          onClick={() => navigation.previous()}
        >
          <i className="fas fa-chevron-left"></i>
          &nbsp;Back
        </button>
        <button
          className="btn btn-medium btn-theme"
          onClick={() => onCallClick()}
        >
          <i className="fas fa-chevron-right"></i>&nbsp;Next
        </button>
      </div>
      <Notification
        isError={isError}
        isInfo={""}
        class_name="float-left col-md-12 mx-auto mb-5"
      />
    </>
  );
};

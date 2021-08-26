import React, { useState, useEffect } from "react";
import {
  BootstrapTable,
  TableHeaderColumn,
  DeleteButton,
} from "react-bootstrap-table";
import Modal from "react-modal";
import { ModelForm } from "../../../ReportsViews/Summary/ModelForm";
import Axios from "axios";
import { URLs, Cookies } from "../../../Urls";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import PageLoader from "../../../FullPageLoader";
import Notification from "../../../Notification";
import DownloadCsv from "../../../Download";
Modal.setAppElement("#root");
export const JobForm = ({ formData, navigation }) => {
  const [isError, setError] = useState("");

  const [jobID, setJobID] = useState();
  const [job, setJob] = useState([]);
  const { promiseInProgress } = usePromiseTracker();
  const [isOpen, setIsOpen] = useState(false);
  function toggleModal() {
    setIsOpen(!isOpen);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = new FormData();
        data.append("from_date", formData.from_date);
        data.append("to_date", formData.to_date);
        data.append("patch_id", formData.patch_id);
        let configHeader = {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies("csrftoken"),
          },
        };
        await Axios.post(
          URLs().CompletedJobs + "get/",
          data,
          configHeader
        ).then((result) => {
          setJob(result.data);
        });
      } catch (error) {
        // console.log(error.toString());
        setError(error.toString());
      }
    };
    trackPromise(fetchData());
  }, [formData]);

  const selectRowProp = {
    mode: "radio",
    bgColor: "#74777b",
    clickToSelect: true,
    onSelect: onClickRow,
  };
  function onClickRow({ job_id }) {
    setJobID(job_id);
    // console.log(job_id);
    toggleModal();
  }
  let header = {
    job_id: "Job ID",
    change_no: "Change No.",
    planned_startdate: "Planned Startdate",
    planned_enddate: "Planned Enddate",
    actual_startdate: "Actual Startdate",
    actual_enddate: "Actual Enddate",
    patch_id: "Patch ID",
  };
  const createCustomDeleteButton = () => {
    return (
      <>
        <DeleteButton
          btnText="Back"
          btnContextual="btn-theme"
          className="btn btn-medium"
          btnGlyphicon="fas fa-chevron-left"
          onClick={() => navigation.previous()}
        />
        <div> &nbsp;&nbsp;</div>
        <DownloadCsv data={job} fields={header} filename={"JobDetails"} />
      </>
    );
  };

  const options = {
    page: 1,
    paginationSize: 3,
    paginationPosition: "bottom",
    hideSizePerPage: true,
    defaultSortName: "job_id", // default sort column name
    defaultSortOrder: "desc", // default sort order
    deleteBtn: createCustomDeleteButton,
  };

  return (
    <>
      {promiseInProgress && <PageLoader />}
      <div className="datatablenew">
        <h4 className="h4Server text-center"> Job Details</h4>
        <BootstrapTable
          striped
          hover
          data={job}
          search={true}
          pagination={true}
          options={options}
          selectRow={selectRowProp}
          deleteRow
          className="table-striped"
        >
          <TableHeaderColumn isKey dataField="job_id" dataSort width="7%">
            Job ID
          </TableHeaderColumn>
          <TableHeaderColumn dataField="change_no">
            Change No.
          </TableHeaderColumn>
          <TableHeaderColumn dataField="planned_startdate">
            Planned Startdate
          </TableHeaderColumn>
          <TableHeaderColumn dataField="planned_enddate">
            Planned Enddate
          </TableHeaderColumn>
          <TableHeaderColumn dataField="actual_startdate">
            Actual Startdate
          </TableHeaderColumn>
          <TableHeaderColumn dataField="actual_enddate">
            Actual Enddate
          </TableHeaderColumn>
          <TableHeaderColumn dataField="patch_id">Patch ID</TableHeaderColumn>
        </BootstrapTable>
      </div>

      <Notification
        isError={isError}
        isInfo={""}
        class_name="col-md-10 mx-auto"
      />

      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="My dialog"
        className="mymodal"
        overlayClassName="myoverlay"
        closeTimeoutMS={500}
      >
        <div className="row">
          <div className="col-4">
            <div className="numbers">
              <h5 className="h4Server">Job Summary</h5>
            </div>
          </div>
          <div className="col-8">
            <button
              type="button"
              className="close buttonIcone danger"
              aria-label="Close"
              onClick={toggleModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
        <ModelForm JobID={jobID} FormType="CompletedJob" StatusType="Running" />
      </Modal>
    </>
  );
};

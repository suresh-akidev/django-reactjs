import React, { useState, useEffect } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Button, Modal } from "react-bootstrap";
import { ModelForm } from "../../ReportsViews/Summary/ModelForm";
import { URLs, Cookies } from "../../Urls";
import Axios from "axios";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import PageLoader from "../../FullPageLoader";
import Notification from "../../Notification";

const ActiveForm = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showDel, setShowDel] = useState(false);
  const handleCloseDel = () => setShowDel(false);
  const handleShowDel = () => setShowDel(true);

  const [isError, setError] = useState("");
  const [isInfo, setInfo] = useState("");

  const [jobID, setJobID] = useState();
  const [statusType, setStatus] = useState();
  const [job, setJob] = useState();
  const { promiseInProgress } = usePromiseTracker();

  useEffect(() => {
    const fetchData = async () => {
      // setError(false);
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().ActiveJobs + "get/");
        setJob(result.data);
      } catch (error) {
        // console.log(error.toString());
        setError(error.toString());
        setInfo("");
      }
    };
    trackPromise(fetchData());
  }, []);

  const selectRowProp = {
    mode: "radio",
    bgColor: "#74777b",
    clickToSelect: true,
    onSelect: onClickRow,
  };
  function onClickRow({ job_id, status }) {
    setJobID(job_id);
    setStatus(status);
    handleShow();
  }

  const handleDeleteButtonClick = () => {
    if (jobID) {
      handleShowDel();
    } else {
      setError("Select the JobID to delete");
    }
  };
  const createCustomDeleteButton = () => {
    return (
      <div>
        {/* <DeleteButton
          btnText="Delete"
          btnContextual="btn-theme"
          className="btn btn-medium"
          btnGlyphicon="fa fa-trash"
          onClick={() => handleDeleteButtonClick()}
        /> */}
        <button
          className="float-left mr-4 buttonIcone danger"
          title="Delete"
          onClick={() => handleDeleteButtonClick()}
        >
          <i className="fa fa-trash"></i>
        </button>
      </div>
    );
  };

  function onAfterDeleteRow() {
    try {
      Axios.delete(URLs().Jobs + jobID + "/")
        .then((res) => {
          // console.log(res.data);
          const updatedItems = job.filter((item) => item.job_id !== jobID);
          setJob(updatedItems);
          setInfo("Job(" + jobID + ") has been deleted successfully");
          setError("");
        })
        .catch((error) => {
          // console.log(error.toString());
          setError(error.toString());
        });
    } catch (error) {
      // console.log(error.toString());
      setError(error.toString());
    }
    handleCloseDel();
  }

  const handleExportCSVButtonClick = (onClick) => {
    onClick();
  };

  const createCustomExportCSVButton = (onClick) => {
    return (
      <div>
        {/* <ExportCSVButton
          btnText="Download"
          btnContextual="btn-theme"
          className="btn btn-medium "
          btnGlyphicon="fas fa-file-csv"
          onClick={(e) => handleExportCSVButtonClick(onClick)}
        /> */}
        <button
          className="float-left mr-4 buttonIcone primary"
          title="Download"
          onClick={(e) => handleExportCSVButtonClick(onClick)}
        >
          <i className="fas fa-file-csv"></i>
        </button>
      </div>
    );
  };
  const options = {
    page: 1,
    paginationSize: 3,
    paginationPosition: "bottom",
    hideSizePerPage: true,
    // defaultSortName: "actual_startdate", // default sort column name
    // defaultSortOrder: "desc", // default sort order
    // afterDeleteRow: onAfterDeleteRow,
    deleteBtn: createCustomDeleteButton,
    exportCSVBtn: createCustomExportCSVButton,
  };
  return (
    <>
      {promiseInProgress && <PageLoader />}
      <div className="datatablenew">
        <h4 className="h4Server text-center">Active Job Details</h4>
        <BootstrapTable
          striped
          hover
          exportCSV
          data={job}
          search={true}
          pagination={true}
          options={options}
          selectRow={selectRowProp}
          deleteRow
          className="table-striped"
        >
          <TableHeaderColumn isKey dataField="job_id" dataSort width={"10%"}>
            Job ID
          </TableHeaderColumn>
          <TableHeaderColumn dataField="change_no" dataSort>
            Change No.
          </TableHeaderColumn>
          <TableHeaderColumn dataField="actual_startdate" dataSort>
            Actual Startdate
          </TableHeaderColumn>
          <TableHeaderColumn dataField="actual_enddate" dataSort>
            Actual Enddate
          </TableHeaderColumn>
          <TableHeaderColumn dataField="patch_id">Patch ID</TableHeaderColumn>
          <TableHeaderColumn dataField="status">Status</TableHeaderColumn>
        </BootstrapTable>
      </div>

      <Notification
        isError={isError}
        isInfo={isInfo}
        class_name="col-md-10 mx-auto"
      />

      <Modal show={show} onHide={handleClose} dialogClassName="datatableModal">
        <Modal.Header closeButton>
          <Modal.Title>Job Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModelForm
            JobID={jobID}
            FormType="ActiveJob"
            StatusType={statusType}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showDel} onHide={handleCloseDel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete item forever?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDel}>
            Close
          </Button>
          <Button variant="danger" onClick={onAfterDeleteRow}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ActiveForm;

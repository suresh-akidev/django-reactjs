import React, { useState, useEffect } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Modal from "react-modal";
import { ModelForm } from "./../../../ReportsViews/Summary/ModelForm";
import { Cookies } from "../../../Urls";
import Axios from "axios";
import PageLoader from "../../../FullPageLoader";
import { DynamicColumns, DynamicURL, DynamicFlag } from "./DataRout";

Modal.setAppElement("#root");

export default function DataTable(props) {
  const { promiseInProgress } = usePromiseTracker();
  const [job, setJob] = useState();
  const columns = DynamicColumns(props.Type);
  const [jobID, setJobID] = useState();
  const [isOpen, setIsOpen] = useState(false);
  function toggleModal() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(DynamicURL(props.Type, props.dropData));
        setJob(result.data);
      } catch (error) {
        // console.log(error.toString());
      }
    };
    trackPromise(fetchData());
  }, [props]);

  const selectRowProp = {
    mode: "radio",
    bgColor: "#6c757d",
    clickToSelect: true,
    onSelect: onClickRow,
  };
  const selectRowColor = {
    bgColor: "#6c757d",
  };
  function onClickRow({ job_id }) {
    setJobID(job_id);
    toggleModal();
  }

  const options = {
    page: 1,
    paginationSize: 3,
    paginationPosition: "bottom",
    hideSizePerPage: true,
    sizePerPage: 5,
  };

  return (
    <>
      {promiseInProgress && <PageLoader />}
      <BootstrapTable
        striped
        hover
        data={job}
        search={true}
        pagination={props.pagination}
        options={options}
        selectRow={DynamicFlag(props.Type) ? selectRowProp : selectRowColor}
        className="table-striped"
        keyField={columns[0].field}
      >
        {columns.map((column, index) => (
          <TableHeaderColumn
            key={index}
            dataField={column.field}
            dataSort
            width={column.width}
            columnTitle={column.title}
          >
            {column.title}
          </TableHeaderColumn>
        ))}
      </BootstrapTable>
      {/* <Modal show={show} onHide={handleClose} dialogClassName="datatableModal">
        <Modal.Header closeButton>
          <Modal.Title>Job Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModelForm
            JobID={jobID}
            FormType="CompletedJob"
            StatusType="Running"
          />
        </Modal.Body>
      </Modal> */}

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
}

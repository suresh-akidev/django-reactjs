import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import Axios from "axios";
import { URLs, Cookies } from "../../Urls";
import DataTable from "./DataTable";
import { Modal } from "react-bootstrap";
import JobLogs from "./JobLogs";
import {
  TableHeader,
  Pagination,
  Search,
} from "../../PaginationSearch/DataTable";
import { trackPromise } from "react-promise-tracker";
import DownloadCsv from "../../Download";

export const ModelForm = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [comments, setComments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({
    field: "server_name",
    order: "asc",
  });
  const JobID = props.JobID;
  const FormType = props.FormType;
  const StatusType = props.StatusType;

  let headers = [];
  let fields = {};
  const ITEMS_PER_PAGE = 7;

  if (FormType === "ActiveJob") {
    headers = [
      { name: "Server", field: "server_name", sortable: true },
      { name: "Patch ID", field: "patch_id", sortable: true },
      { name: "Executiondate", field: "patch_executiondate", sortable: true },
      { name: "Status", field: "status", sortable: false },
      // { name: "Kernel", field: "kernel_version", sortable: true },
      { name: "Validation", field: "status", sortable: false },
    ];
    fields = {
      server_name: "Server",
      patch_id: "Patch ID",
      patch_executiondate: "Executiondate",
      status: "Status",
    };
  } else {
    headers = [
      { name: "Server", field: "server_name", sortable: true },
      { name: "Patch ID", field: "patch_id", sortable: true },
      { name: "Executiondate", field: "patch_executiondate", sortable: true },
      { name: "Status", field: "status", sortable: false },
      { name: "Kernel", field: "kernel_version", sortable: true },
      { name: "Validation", field: "status", sortable: false },
    ];
    fields = {
      server_name: "Server",
      patch_id: "Patch ID",
      patch_executiondate: "Executiondate",
      status: "Status",
      kernel_version: "Kernel",
    };
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().Summary + "job/" + JobID + "/");
        setComments(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    trackPromise(fetchData());
  }, [JobID]);

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      if (FormType === "ActiveJob") {
        computedComments = computedComments.filter(
          (comment) =>
            comment.server_name.toLowerCase().includes(search.toLowerCase()) ||
            comment.patch_id.toLowerCase().includes(search.toLowerCase()) ||
            comment.patch_executiondate
              .toLowerCase()
              .includes(search.toLowerCase())
          // ||  comment.kernel_version.toLowerCase().includes(search.toLowerCase())
        );
      } else {
        computedComments = computedComments.filter(
          (comment) =>
            comment.server_name.toLowerCase().includes(search.toLowerCase()) ||
            comment.patch_id.toLowerCase().includes(search.toLowerCase()) ||
            comment.patch_executiondate
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            comment.kernel_version.toLowerCase().includes(search.toLowerCase())
        );
      }
    }

    setTotalItems(computedComments.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedComments = computedComments.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedComments.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [comments, currentPage, search, sorting, FormType]);
  return (
    <>
      <Container className="text-center">
        <Row>
          <Col>
            <span className="text-primary float-left">
              <DownloadCsv
                data={comments}
                fields={fields}
                filename={"ActiveJobSummary"}
              />
            </span>
          </Col>
          <Col>
            <span className="text-primary">Job Id : {JobID}</span>
          </Col>
          <Col>
            <Search
              onSearch={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="react-bs-table react-bs-table-bordered">
              <div className="react-bs-container-header table-header-wrapper">
                <Table className="table table-bordered table-striped">
                  <TableHeader
                    headers={headers}
                    onSorting={(field, order) => setSorting({ field, order })}
                  />
                  <DataTable
                    comments={commentsData}
                    JobID={JobID}
                    FormType={FormType}
                  />
                </Table>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="">
            {StatusType === "Running" && (
              <span className="float-left">
                <button
                  className="btn btn-sm btn-theme mt-2 mr-2"
                  type="button"
                  onClick={handleShow}
                >
                  <i className="fas fa-file-download"></i>&nbsp;Job Logs
                </button>
              </span>
            )}
          </Col>
          <Col>
            <div className="w-auto float-right mb-5 mt-2">
              <Pagination
                total={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </Col>
        </Row>
      </Container>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modalViewwidh60 datatableModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Job Logs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <JobLogs JobID={JobID} />
        </Modal.Body>
      </Modal>
    </>
  );
};

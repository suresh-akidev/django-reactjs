import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import Axios from "axios";
import { URLs, Cookies } from "../../../Urls";
import DataTable from "../../../ReportsViews/Summary/DataTable";
import {
  TableHeader,
  Pagination,
  Search,
} from "../../../PaginationSearch/DataTable";
import DownloadCsv from "../../../Download";

export const ServerForm = ({ formData, navigation }) => {
  const [comments, setComments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({
    field: "server_name",
    order: "asc",
  });

  let headers = [
    // { name: "Job ID", field: "job_id", sortable: true },
    { name: "Server", field: "server_name", sortable: true },
    { name: "Patch ID", field: "patch_id", sortable: true },
    { name: "Executiondate", field: "patch_executiondate", sortable: true },
    { name: "Status", field: "status", sortable: false },
    { name: "Kernel", field: "kernel_version", sortable: true },
    { name: "Validation", field: "status", sortable: false },
  ];
  const ITEMS_PER_PAGE = 5;
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = new FormData();
        data.append("from_date", formData.from_date);
        data.append("to_date", formData.to_date);
        data.append("technology", formData.technology);
        let configHeader = {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies("csrftoken"),
          },
        };
        await Axios.post(
          URLs().CompletedServers + "get/",
          data,
          configHeader
        ).then((result) => {
          setComments(result.data);
        });
      } catch (error) {
        console.log(error.toString());
        // setError(error.toString());
      }
    };
    fetchData();
  }, [formData]);

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      computedComments = computedComments.filter(
        (comment) =>
          comment.server_name.toLowerCase().includes(search.toLowerCase()) ||
          comment.patch_id.toLowerCase().includes(search.toLowerCase()) ||
          comment.patch_executiondate
            .toLowerCase()
            .includes(search.toLowerCase())
      );
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
  }, [comments, currentPage, search, sorting]);

  let header = {
    server_name: "Server",
    patch_id: "Patch ID",
    patch_executiondate: "Executiondate",
    status: "Status",
    kernel_version: "Kernel",
  };
  return (
    <>
      <Container className="text-center">
        <Row>
          <Col>
            <div className="float-left">
              <button
                className="btn btn-medium btn-theme btn-sm"
                onClick={() => navigation.previous()}
              >
                <i className="fas fa-chevron-left"></i>
                &nbsp;Back
              </button>
              &nbsp;&nbsp;
              <DownloadCsv
                data={comments}
                fields={header}
                filename={"ServerDetails"}
              />
            </div>
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
                    JobID={""}
                    FormType={"CompletedJob"}
                  />
                </Table>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col></Col>
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
    </>
  );
};

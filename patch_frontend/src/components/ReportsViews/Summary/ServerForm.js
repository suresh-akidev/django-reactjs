import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import Axios from "axios";
import { URLs, Cookies } from "../../Urls";
import DataTable from "./DataTable";
import {
  TableHeader,
  Pagination,
  Search,
} from "../../PaginationSearch/DataTable";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import PageLoader from "./../../FullPageLoader";

export const ServerForm = (props) => {
  const { promiseInProgress } = usePromiseTracker();
  const [comments, setComments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({
    field: "server_name",
    order: "asc",
  });
  const Myear = props.Myear;

  let headers = [
    // { name: "Job ID", field: "job_id", sortable: true },
    { name: "Server", field: "server_name", sortable: true },
    { name: "Patch ID", field: "patch_id", sortable: true },
    { name: "Executiondate", field: "patch_executiondate", sortable: true },
    { name: "Status", field: "status", sortable: false },
    { name: "Kernel", field: "kernel_version", sortable: true },
    { name: "Validation", field: "status", sortable: false },
  ];
  const ITEMS_PER_PAGE = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = new FormData();
        data.append("myear", Myear);
        let configHeader = {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies("csrftoken"),
          },
        };
        await Axios.post(
          URLs().MonthlyJobs + "serverlist/",
          data,
          configHeader
        ).then((result) => {
          // console.log(result.data);
          setComments(result.data);
        });
      } catch (error) {
        // console.log(error.toString());
        // setError(error.toString());
      }
    };
    trackPromise(fetchData());
  }, [Myear]);

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
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
  return (
    <>
      {promiseInProgress && <PageLoader />}
      <Container className="text-center">
        <Row>
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
                  <DataTable comments={commentsData} JobID={""} FormType={""} />
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

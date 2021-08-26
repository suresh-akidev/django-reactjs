import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import { URLs, Cookies } from "../../Urls";
import Axios from "axios";
import PageLoader from "../../FullPageLoader";
import {
  TableHeader,
  Pagination,
  Search,
} from "../../PaginationSearch/DataTable";

const Notification = lazy(() => import("../../Notification"));
const ModelForm = lazy(() => import("./Modals/Modal"));
const DataTable = lazy(() => import("./Tables/DataTable"));
const Upload = lazy(() => import("./Modals/Upload"));
const Download = lazy(() => import("./Modals/Download"));
const Bulk = lazy(() => import("./Modals/Bulk"));
const Technology = lazy(() => import("./Modals/Technology"));

function Server(props) {
  const [comments, setComments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({
    field: "server_name",
    order: "asc",
  });
  const [isError, setError] = useState("");
  const [isInfo, setInfo] = useState("");

  const addItemToState = (comment) => {
    if (Array.isArray(comment)) {
      // console.log(comment);
      if (comment.length > 0) {
        setComments([...comments, ...comment]);
        setInfo(
          "Servers(" + comment.length + ") have been created successfully"
        );
      }
    } else {
      setComments([...comments, comment]);
      setInfo(
        "Server(" + comment.server_name + ") has been created successfully"
      );
    }
  };

  const updateErrorState = (Error) => {
    if (Array.isArray(Error)) {
      if (Error.length > 0) {
        setError(JSON.stringify(Error));
        setInfo("");
      }
    } else {
      setError(Error);
    }
  };

  const updateInfoState = (Info) => {
    if (Array.isArray(Info)) {
      if (Info.length > 0) {
        setInfo(JSON.stringify(Info));
      }
    } else {
      setInfo(Info);
    }

    setError("");
    // trackPromise(fetchData());
  };

  const updateState = (comment) => {
    if (Array.isArray(comment)) {
      if (comment.length > 0) {
        let totArray = comments;
        for (const row of comment) {
          // console.log(row);
          const itemIndex = comments.findIndex(
            (data) => data.server_name === row.server_name
          );
          let newArray = [
            ...totArray.slice(0, itemIndex),
            row,
            ...totArray.slice(itemIndex + 1),
          ];
          totArray = newArray;
        }
        setComments(totArray);
        if (isInfo === "") {
          setInfo(
            "Server(" + comment.length + ") has been updated successfully"
          );
        } else {
          setInfo(
            ...isInfo,
            "Server(" + comment.length + ") has been updated successfully"
          );
        }
      }
    } else {
      const itemIndex = comments.findIndex(
        (data) => data.server_name === comment.server_name
      );
      const newArray = [
        ...comments.slice(0, itemIndex),
        comment,
        ...comments.slice(itemIndex + 1),
      ];
      setComments(newArray);
      setInfo(
        "Server(" + comment.server_name + ") has been updated successfully"
      );
    }
  };

  const deleteItemFromState = (server_name) => {
    const updatedItems = comments.filter(
      (comment) => comment.server_name !== server_name
    );
    setComments(updatedItems);
    setInfo("Server(" + server_name + ") has been deleted successfully");
    // setError("");
  };

  const ITEMS_PER_PAGE = 7;
  const headers = [
    { name: "Server", field: "server_name", sortable: true },
    { name: "IP", field: "ip_address", sortable: true },
    { name: "OS", field: "os_name", sortable: true },
    { name: "Criticality", field: "criticality", sortable: true },
    { name: "Credential", field: "credential_path", sortable: true },
    { name: "Backup", field: "backup_server", sortable: true },
    { name: "B.Enabled", field: "backup_enabled", sortable: false },
    { name: "Monitoring", field: "monitor_server", sortable: true },
    { name: "M.Enabled", field: "monitor_enabled", sortable: false },
    { name: "Action", field: "action", sortable: false },
  ];
  const fetchData = async () => {
    try {
      Axios.defaults.headers.common = {
        "X-CSRFToken": Cookies("csrftoken"),
      };
      const result = await Axios.get(URLs().Servers + "get/");
      setComments(result.data);
      // console.log(result.data);
    } catch (error) {
      // console.log(error.toString());
      setError(error.toString());
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      computedComments = computedComments.filter(
        (comment) =>
          comment.server_name.toLowerCase().includes(search.toLowerCase()) ||
          comment.ip_address.toLowerCase().includes(search.toLowerCase()) ||
          comment.os_name.toLowerCase().includes(search.toLowerCase()) ||
          comment.criticality.toLowerCase().includes(search.toLowerCase()) ||
          comment.credential_path
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          comment.backup_server.toLowerCase().includes(search.toLowerCase()) ||
          comment.monitor_server.toLowerCase().includes(search.toLowerCase())
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
      <Suspense fallback={<PageLoader />}>
        <Container className="text-center">
          <h4 className="h4Server">Server Details</h4>
          <Row>
            <Col>
              <ModelForm
                buttonLabel="Add Item"
                addItemToState={addItemToState}
                updateErrorState={updateErrorState}
                className="datatableModal modalViewwidh50"
              />
              <Download />
              <Upload
                buttonLabel="Upload"
                addItemToState={addItemToState}
                updateState={updateState}
                updateErrorState={updateErrorState}
              />
              <Bulk
                className="modalViewwidh40 datatableModal"
                updateErrorState={updateErrorState}
                updateInfoState={updateInfoState}
              />
              <Technology
                className="modalViewwidh40 datatableModal"
                updateErrorState={updateErrorState}
                updateInfoState={updateInfoState}
              />
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
                      updateState={updateState}
                      deleteItemFromState={deleteItemFromState}
                      updateErrorState={updateErrorState}
                    />
                  </Table>
                </div>
              </div>
            </Col>
          </Row>
          <div className="w-auto float-right mb-5 mt-2">
            <Pagination
              total={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
          <Notification
            isError={isError}
            isInfo={isInfo}
            class_name="col-md-10 mx-auto mb-5"
          />
        </Container>
      </Suspense>
    </>
  );
}

export default Server;

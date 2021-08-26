import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import ModelForm from "./Modals/Modal";
import DataTable from "./Tables/DataTable";
import { URLs, Cookies } from "../../Urls";
import { useMenuActive } from "../Settings";
import Axios from "axios";
import {
  TableHeader,
  Pagination,
  Search,
} from "../../PaginationSearch/DataTable";
import PageLoader from "../../FullPageLoader";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Notification from "../../Notification";

function Monitor(props) {
  const [comments, setComments] = useState([]);
  const { promiseInProgress } = usePromiseTracker();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({
    field: "monitor_server",
    order: "asc",
  });
  const [isError, setError] = useState("");
  const [isInfo, setInfo] = useState("");
  const classItem = useMenuActive();
  const addItemToState = (comment) => {
    setComments([...comments, comment]);
    setInfo(
      "Monitoring Server(" +
        comment.monitor_server +
        ") has been created successfully"
    );
    setError("");
    if (comments.length === 0 && classItem > 0) {
      props.addMenuToState(3);
    }
  };
  const updateErrorState = (Error) => {
    setInfo("");
    setError(Error);
  };
  const updateState = (comment) => {
    const itemIndex = comments.findIndex(
      (data) => data.monitor_server === comment.monitor_server
    );
    const newArray = [
      ...comments.slice(0, itemIndex),
      comment,
      ...comments.slice(itemIndex + 1),
    ];
    setComments(newArray);
    setInfo(
      "Monitoring Server(" +
        comment.monitor_server +
        ") has been updated successfully"
    );
    setError("");
  };

  const deleteItemFromState = (monitor_server) => {
    const updatedItems = comments.filter(
      (comment) => comment.monitor_server !== monitor_server
    );
    setComments(updatedItems);
    setInfo(
      "Monitoring Server(" + monitor_server + ") has been deleted successfully"
    );
    setError("");
    if (comments.length === 1 && classItem > 0) {
      props.addMenuToState(2);
    }
  };

  const ITEMS_PER_PAGE = 7;
  const headers = [
    { name: "Account Name", field: "account_name", sortable: false },
    { name: "Monitor Server", field: "monitor_server", sortable: true },
    { name: "IP Address", field: "server_ip", sortable: true },
    { name: "Monitor Url", field: "monitor_url", sortable: true },
    { name: "Action", field: "action", sortable: false },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().Monitor + "get/");
        if (isMounted) {
          setComments(result.data);
        }
      } catch (error) {
        // console.log(error);
        // console.log(error.toString());
        setError(error.toString());
      }
    };
    trackPromise(fetchData());
    return () => {
      isMounted = false;
    };
  }, []);

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      computedComments = computedComments.filter(
        (comment) =>
          comment.monitor_server.toLowerCase().includes(search.toLowerCase()) ||
          comment.server_ip.toLowerCase().includes(search.toLowerCase()) ||
          comment.monitor_url.toLowerCase().includes(search.toLowerCase())
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
        <h4 className="h4Server">Monitoring Server</h4>
        <Row>
          <Col>
            <ModelForm
              buttonLabel="Add Item"
              addItemToState={addItemToState}
              updateErrorState={updateErrorState}
              className="datatableModal modalViewwidh50"
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
          class_name="col-md-10 mx-auto"
        />
      </Container>
    </>
  );
}

export default Monitor;

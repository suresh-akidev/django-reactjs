import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col } from "reactstrap";
import ModelForm from "./Modals/Modal";
import DataTable from "./Tables/DataTable";
import { URLs, Cookies } from "../../Urls";
import Axios from "axios";
import { Table } from "reactstrap";
import {
  TableHeader,
  Pagination,
  Search,
} from "../../PaginationSearch/DataTable";
import PageLoader from "../../FullPageLoader";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Notification from "../../Notification";

function Patches(props) {
  const [comments, setComments] = useState([]);
  const { promiseInProgress } = usePromiseTracker();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({
    field: "release_date",
    order: "desc",
  });
  const [isError, setError] = useState("");
  const [isInfo, setInfo] = useState("");

  const addItemToState = (comment) => {
    setComments([...comments, comment]);
    setInfo("Patch(" + comment.patch_id + ") has been created successfully");
    setError("");
  };
  const updateErrorState = (Error) => {
    setInfo("");
    setError(Error);
  };
  const updateState = (comment) => {
    const itemIndex = comments.findIndex(
      (data) => data.patch_id === comment.patch_id
    );
    const newArray = [
      ...comments.slice(0, itemIndex),
      comment,
      ...comments.slice(itemIndex + 1),
    ];
    setComments(newArray);
    setInfo("Patch(" + comment.patch_id + ") has been updated successfully");
    setError("");
  };

  const deleteItemFromState = (patch_id) => {
    const updatedItems = comments.filter(
      (comment) => comment.patch_id !== patch_id
    );
    setComments(updatedItems);
    setInfo("Patch(" + patch_id + ") has been deleted successfully");
    setError("");
  };

  const ITEMS_PER_PAGE = 7;
  const headers = [
    { name: "Patch ID", field: "patch_id", sortable: true },
    { name: "Patch Name", field: "patch_name", sortable: true },
    { name: "Technology Name", field: "technology_id", sortable: true },
    { name: "Severity Rating", field: "severity", sortable: true },
    { name: "Release Date", field: "release_date", sortable: true },
    { name: "Action", field: "action", sortable: false },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().Patch + "get/");
        setComments(result.data);
      } catch (error) {
        // console.log(error.toString());
        setError(error.toString());
      }
    };
    trackPromise(fetchData());
  }, []);

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      computedComments = computedComments.filter(
        (comment) =>
          comment.patch_id.toLowerCase().includes(search.toLowerCase()) ||
          comment.patch_name.toLowerCase().includes(search.toLowerCase()) ||
          comment.severity.toLowerCase().includes(search.toLowerCase()) ||
          comment.release_date.toLowerCase().includes(search.toLowerCase())
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
        <h4 className="h4Server">Patch details</h4>
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

export default Patches;

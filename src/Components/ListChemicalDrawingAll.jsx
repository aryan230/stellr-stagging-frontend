import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import URL from "./../Data/data.json";
import axios from "axios";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { addTime } from "./Functions/addTime";
function ListChemicalDrawingAll({
  setCDModalContent,
  setCDModal,
  CDUpdate,
  setCDUpdate,
  setCreateDrawingModal,
}) {
  const [data, setData] = useState();
  const userLogin = useSelector((state) => state.userLogin);
  let { loading, error, userInfo } = userLogin;
  const userDetails = useSelector((state) => state.userDetails);
  const {
    loading: loadingUserDetails,
    error: errorLoadingDetails,
    sucess: sucessLoadingDetails,
    user,
  } = userDetails;

  const renderDetailsButton = (params) => {
    return (
      <button
        type="button"
        onClick={() => {
          const docTwo = data && data.find((e) => e._id == params.row._id);
          setCDModalContent(docTwo);
          setCDModal(true);
        }}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
      >
        View
      </button>
    );
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: false,
    },

    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      editable: false,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 150,
    },
    {
      field: "updatedAt",
      headerName: "Last Modified At",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 150,
    },
    {
      field: "updatedBy",
      headerName: "Last Modified By",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 150,
    },
    {
      field: "view",
      headerName: "View",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 150,
      renderCell: renderDetailsButton,
    },
  ];

  const getMyCDs = async () => {
    var config = {
      method: "get",
      url: `${URL}api/cd`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      data: data,
    };

    axios(config)
      .then(function(response) {
        console.log(JSON.stringify(response.data));
        setData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!data) {
      getMyCDs();
    }
  }, [data]);

  useEffect(() => {
    if (CDUpdate) {
      getMyCDs();
      setCDUpdate(false);
    }
  }, [CDUpdate]);

  return (
    <div className="project-component">
      <div className="project-component-inside">
        <div className="p-c-s-i-t">
          <div className="ps-c-it-inside">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <svg
                      className="w-3 h-3 mr-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    Home
                  </a>
                </li>
              </ol>
            </nav>

            <h1>Chemical Drawing Registries</h1>
          </div>
          <div className="p-c-s-i-t-left">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setCreateDrawingModal(true);
              }}
              className="text-white bg-blue-700 hover:bg-blue-800  focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add New Chemical Drawing
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-c-s-charts">
          {!data ? (
            <div className="loader-div-main-stellr">
              <div role="status">
                <svg
                  aria-hidden="true"
                  class="w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          ) : data && data.length > 0 ? (
            <Box sx={{ height: "90%", width: "100%" }}>
              <DataGrid
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { disableToolbarButton: false },
                  },
                }}
                rows={data.map(
                  ({
                    _id: _id,
                    name: name,
                    createdAt: createdAt,
                    type: recordType,
                    updatedAt: updatedAt,
                  }) => ({
                    _id,
                    id: `${_id}`,
                    name: name,
                    recordType,
                    updatedAt: addTime(updatedAt),
                    createdAt: addTime(createdAt),
                    createdBy: user.name ? user.name : userInfo.name,
                    updatedBy: user.name ? user.name : userInfo.name,
                    view: "View",
                  })
                )}
                columns={columns}
                // initialState={{
                //   pagination: {
                //     paginationModel: {
                //       pageSize: 8,
                //     },
                //   },
                // }}
                // pageSizeOptions={[3]}
                checkboxSelection
                disableRowSelectionOnClick
                onSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids);
                  const selectedRowData = data
                    .map(
                      ({
                        sampleId: id,
                        data: name,
                        createdAt: createdAt,
                        type: recordType,
                        updatedAt: updatedAt,
                      }) => ({
                        id: `SAM-000${id}`,
                        name: "JSON.parse(name).sampleName",
                        createdAt: new Date(createdAt)
                          .toLocaleString("en-GB")
                          .split(",")[0],
                        recordType,
                        updatedAt: new Date(updatedAt)
                          .toLocaleString("en-GB")
                          .split(",")[0],
                        createdDate: createdAt,
                        createdBy: userInfo.name,
                        updatedBy: userInfo.name,
                        view: "View",
                      })
                    )
                    .filter((row) => selectedIDs.has(row.id.toString()));
                  console.log(selectedRowData);
                }}
              />
            </Box>
          ) : (
            <div className="everything-alignment-center">
              <img src="./assets/4.svg" />
              <p>There is nothing here yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListChemicalDrawingAll;

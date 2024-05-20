import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import {
  listMyCollabProjects,
  listMyProjects,
} from "../redux/actions/projectActions";
import { listMyCollabOrgs } from "../redux/actions/organizationActions";
import _, { forEach } from "lodash";
import Reports from "./ReportsAndDashboard/Reports/Reports";
import BasicArea from "./Charts/BasicArea";
import { Pie } from "react-chartjs-2";
import BasicBar from "./Charts/Basicbar";
import { listMyEntries } from "../redux/actions/entryActions";
import CustomArea from "./Charts/CustomArea";
import CustomPieChart from "./CustomCharts/CustomPieChart";
import CustomLine from "./CustomCharts/CustomLine";
import CustomAreaChart from "./CustomCharts/CustomAreaChart";
import CustomFunnel from "./CustomCharts/CustomFunnel";
import axios from "axios";
import CustomColumnChartDist from "./CustomCharts/CustomColumnChartDist";
import CustomScatterChart from "./CustomCharts/CustomScatterChart";
import URL from "./../Data/data.json";
import CreateNewReport from "./ReportsAndDashboard/Reports/CreateNewReport";
function ListProjectsNew({
  setWhichTabisActive,
  setReportTab,
  reportTab,
  newReport,
  setNewReport,
  setActiveReport,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [projectEntryData, setProjectEntryData] = useState([]);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [projectStats, setProjectStats] = useState();
  const projectListMy = useSelector((state) => state.projectListMy);
  const {
    projects,
    loading: loadingOrders,
    error: errorOrders,
  } = projectListMy;

  const projecListMyCollab = useSelector((state) => state.projecListMyCollab);
  const {
    projects: projectsCollab,
    loading: projectCollabLoading,
    error: errorCollabLoading,
  } = projecListMyCollab;

  const projectListMyOrg = useSelector((state) => state.projectListMyOrg);
  const {
    projects: projectsOrg,
    loading: projectOrgLoading,
    error: errorOrgLoading,
  } = projectListMyOrg;

  useEffect(() => {
    dispatch(listMyProjects());
    dispatch(listMyCollabProjects());
    dispatch(listMyCollabOrgs());
  }, [dispatch]);

  let newArr =
    projects && projectsCollab && projectsOrg
      ? _.unionBy(projects, projectsCollab, projectsOrg, "_id")
      : _.unionBy(projects, projectsCollab, "_id");

  const labels = ["My Projects", "Collaborated Projects"];

  let projectList = newArr && newArr.map((e) => e.name);
  let dataInsideLine = newArr && {
    name: "Projects",
    data: [
      newArr.filter((e) => e.createdAt.split("-")[1] == "01").length,

      newArr.filter((e) => e.createdAt.split("-")[1] == "02").length,

      newArr.filter((e) => e.createdAt.split("-")[1] == "03").length,

      newArr.filter((e) => e.createdAt.split("-")[1] == "04").length,

      newArr.filter((e) => e.createdAt.split("-")[1] == "05").length,

      newArr.filter((e) => e.createdAt.split("-")[1] == "06").length,

      newArr.filter((e) => e.createdAt.split("-")[1] == "07").length,

      newArr.filter((e) => e.createdAt.split("-")[1] == "08").length,

      newArr.filter((e) => e.createdAt.split("-")[1] == "09").length,

      newArr.filter((e) => e.createdAt.split("-")[1] == "10").length,

      newArr.filter((e) => e.createdAt.split("-")[1] == "11").length,

      newArr.filter((e) => e.createdAt.split("-")[1] == "12").length,
    ],
  };

  const getProjectStats = async () => {
    var data = JSON.stringify({
      projectId: newArr.map(({ _id, name }) => ({ _id, name })),
    });

    var config = {
      method: "post",
      url: `${URL}api/projects/stats`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function(response) {
        setProjectStats(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (newArr) {
      if (!projectStats) {
        getProjectStats();
      }
    }
  }, [newArr, projectStats]);
  return (
    <div className="project-component-inside-samples">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Data Registries and Management | Bio-Pharma ELN Software</title>
        <meta
          name="description"
          content="Effectively manage and maintain data registries with our specialized Bio-Pharma ELN software. Simplify data organization and accessibility."
        />
      </Helmet>
      {projectStats && reportTab && (
        <CreateNewReport
          reportTab={reportTab}
          setReportTab={setReportTab}
          dataValue={
            newArr &&
            projectStats && { projects: newArr, projectStats: projectStats }
          }
          typeFrom="Projects"
          newReport={newReport}
          setNewReport={setNewReport}
          setActiveReport={setActiveReport}
        />
      )}

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

          <h1>Project Registries</h1>
        </div>

        <div className="p-c-s-i-t-left">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setWhichTabisActive("projectList");
            }}
            className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
          >
            View All Projects
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setReportTab(true);
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create Report
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
        <div className="area-chart">
          {loadingOrders ? (
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
          ) : (
            <CustomColumnChartDist
              dataInside={
                projectStats
                  ? {
                      name: "Record Count",
                      data: projectStats.stats.map((e) => e.entries),
                    }
                  : []
              }
              dataLabel={
                projectStats ? projectStats.stats.map((e) => e.name) : []
              }
            />
          )}
        </div>

        <div className="samples-below-chart-div">
          {loadingOrders ? (
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
          ) : (
            <Box sx={{ height: "90%", width: "100%" }}>
              <CustomPieChart
                labels={labels}
                seriesData={[projects.length, newArr.length - projects.length]}
              />
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListProjectsNew;

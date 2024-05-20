import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  listMyCollabProjects,
  listMyOrgProjects,
  listMyProjects,
} from "../redux/actions/projectActions";
import axios from "axios";
import URL from "./../Data/data.json";
import { Helmet } from "react-helmet";
import { addTime } from "./Functions/addTime";
import { FileText, Folders, Table2 } from "lucide-react";
import NewSpreadSheet from "./Modals/NewSpreadSheet";
import { addToState } from "../redux/actions/stateActions";
import { addToCart } from "../redux/actions/cartActions";

function ListEntriesMainAll({ setWhichTabisActive, setTabId }) {
  const dispatch = useDispatch();
  const [inputSearch, setInputSearch] = useState("");

  //userinfo

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  //projects

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

  let newArrProjects =
    projects &&
    projectsCollab &&
    projectsOrg &&
    _.unionBy(projects, projectsCollab, projectsOrg, "_id");

  // Entries
  const [projectStats, setProjectStats] = useState(false);
  const getProjectStats = async () => {
    var data = JSON.stringify({
      projectId: newArrProjects.map(({ _id, name }) => ({ _id, name })),
    });

    var config = {
      method: "post",
      url: `${URL}api/projects/entry-data`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function(response) {
        console.log(response.data);
        let entriesArray = [];
        response.data.stats.map((e) => {
          e.entries.map((p) => {
            entriesArray.push(p);
          });
        });
        setProjectStats(entriesArray);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  useEffect(() => {
    if (newArrProjects) {
      if (!projectStats) {
        getProjectStats();
      }
    }
  }, [newArrProjects, projectStats]);

  useEffect(() => {
    dispatch(listMyProjects());
    dispatch(listMyCollabProjects());
    dispatch(listMyOrgProjects());
  }, [dispatch]);
  const [isSpreadSheetOpen, setIsSpreadSheetOpen] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState({});

  return (
    <div className="project-component">
      {isSpreadSheetOpen && (
        <NewSpreadSheet
          spreadsheetData={spreadsheetData}
          setIsSpreadSheetOpen={setIsSpreadSheetOpen}
        />
      )}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Projects Management | Electronic Lab Notebook</title>
        <meta
          name="description"
          content="Efficiently manage and track bio-pharma research projects with ourElectronic Lab Notebook software. Simplify collaboration and enhance data organization."
        />
      </Helmet>

      <>
        {projectStats && (
          <div className="project-component-inside">
            <div className="project-c-header">
              <div className="project-c-header-left">
                <h1>Browse Lab Entries</h1>

                {/* <div className="project-c-header-right">
              <button
                onClick={() => {
                  setModal(true);
                }}
                className="setting-btn add-sample"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M9 1.5C7.51664 1.5 6.0666 1.93987 4.83323 2.76398C3.59986 3.58809 2.63856 4.75943 2.07091 6.12987C1.50325 7.50032 1.35472 9.00832 1.64411 10.4632C1.9335 11.918 2.64781 13.2544 3.6967 14.3033C4.7456 15.3522 6.08197 16.0665 7.53683 16.3559C8.99168 16.6453 10.4997 16.4968 11.8701 15.9291C13.2406 15.3614 14.4119 14.4001 15.236 13.1668C16.0601 11.9334 16.5 10.4834 16.5 9C16.5 8.01509 16.306 7.03982 15.9291 6.12987C15.5522 5.21993 14.9997 4.39314 14.3033 3.6967C13.6069 3.00026 12.7801 2.44781 11.8701 2.0709C10.9602 1.69399 9.98492 1.5 9 1.5V1.5ZM9 15C7.81332 15 6.65328 14.6481 5.66658 13.9888C4.67989 13.3295 3.91085 12.3925 3.45673 11.2961C3.0026 10.1997 2.88378 8.99334 3.11529 7.82946C3.3468 6.66557 3.91825 5.59647 4.75736 4.75736C5.59648 3.91824 6.66558 3.3468 7.82946 3.11529C8.99335 2.88378 10.1997 3.0026 11.2961 3.45672C12.3925 3.91085 13.3295 4.67988 13.9888 5.66658C14.6481 6.65327 15 7.81331 15 9C15 10.5913 14.3679 12.1174 13.2426 13.2426C12.1174 14.3679 10.5913 15 9 15V15ZM12 8.25H9.75V6C9.75 5.80109 9.67099 5.61032 9.53033 5.46967C9.38968 5.32902 9.19892 5.25 9 5.25C8.80109 5.25 8.61033 5.32902 8.46967 5.46967C8.32902 5.61032 8.25 5.80109 8.25 6V8.25H6C5.80109 8.25 5.61033 8.32902 5.46967 8.46967C5.32902 8.61032 5.25 8.80109 5.25 9C5.25 9.19891 5.32902 9.38968 5.46967 9.53033C5.61033 9.67098 5.80109 9.75 6 9.75H8.25V12C8.25 12.1989 8.32902 12.3897 8.46967 12.5303C8.61033 12.671 8.80109 12.75 9 12.75C9.19892 12.75 9.38968 12.671 9.53033 12.5303C9.67099 12.3897 9.75 12.1989 9.75 12V9.75H12C12.1989 9.75 12.3897 9.67098 12.5303 9.53033C12.671 9.38968 12.75 9.19891 12.75 9C12.75 8.80109 12.671 8.61032 12.5303 8.46967C12.3897 8.32902 12.1989 8.25 12 8.25Z"
                    fill="white"
                  />
                </svg>
                Add
              </button>
            </div> */}
              </div>
              <input
                type="text"
                placeholder={`Search Lab Entries`}
                onChange={(e) => setInputSearch(e.target.value)}
              />
            </div>

            <div className="project-c-bottom">
              <button
                className="sl-element white sticky top-0 bg-white"
                onClick={async (e) => {
                  e.preventDefault();
                }}
              >
                <div className="mnc-element-inside">
                  <div className="mnc-element-left">
                    <h3>Name of the Lab Entry</h3>
                  </div>
                  <span> ID</span>
                  <span>Created Date </span>
                  <span>Updated Date</span>
                </div>
              </button>
              {projectStats && projectStats.length > 0 ? (
                projectStats
                  .filter((e) => e.type != "Lab Sheet")
                  .filter(
                    (entry) =>
                      entry.name
                        .toLowerCase()
                        .includes(inputSearch.toLowerCase()) &&
                      entry.deleted === false
                  )
                  .map((project, index) => (
                    <button
                      className="sl-element"
                      onClick={async (e) => {
                        e.preventDefault();
                        await dispatch(
                          addToCart({
                            doc: project,
                            project: project.project,
                            userType: "Admin",
                          })
                        );
                        setTabId(project._id);
                        setWhichTabisActive("tabs");
                      }}
                    >
                      <div className="mnc-element-inside">
                        <div className="mnc-element-left">
                          <FileText size={16} color="#2563eb" />
                          <p>{project.name}</p>
                        </div>
                        <span>ENT-{String(index + 1).padStart(4, "0")}</span>
                        <span>{addTime(project.createdAt)}</span>
                        <span>{addTime(project.updatedAt)}</span>
                      </div>
                    </button>
                  ))
              ) : (
                <div className="middlenav-empty py-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                  >
                    <path
                      d="M31.6663 3.33333H8.33301C7.00693 3.33333 5.73516 3.86011 4.79747 4.79779C3.85979 5.73548 3.33301 7.00725 3.33301 8.33333V10.2833C3.33277 10.9716 3.47462 11.6524 3.74967 12.2833V12.3833C3.98514 12.9183 4.31866 13.4044 4.73301 13.8167L14.9997 24.0167V35C14.9991 35.2832 15.0707 35.5619 15.2078 35.8098C15.3449 36.0577 15.5428 36.2665 15.783 36.4167C16.0482 36.581 16.3543 36.6677 16.6663 36.6667C16.9272 36.6651 17.1841 36.6023 17.4163 36.4833L24.083 33.15C24.3579 33.0115 24.589 32.7996 24.7508 32.5378C24.9126 32.276 24.9987 31.9744 24.9997 31.6667V24.0167L35.1997 13.8167C35.614 13.4044 35.9475 12.9183 36.183 12.3833V12.2833C36.481 11.6574 36.6456 10.9763 36.6663 10.2833V8.33333C36.6663 7.00725 36.1396 5.73548 35.2019 4.79779C34.2642 3.86011 32.9924 3.33333 31.6663 3.33333ZM22.1497 22.15C21.9952 22.3057 21.873 22.4904 21.7901 22.6935C21.7071 22.8965 21.6651 23.114 21.6663 23.3333V30.6333L18.333 32.3V23.3333C18.3343 23.114 18.2922 22.8965 18.2093 22.6935C18.1264 22.4904 18.0041 22.3057 17.8497 22.15L9.01634 13.3333H30.983L22.1497 22.15ZM33.333 10H6.66634V8.33333C6.66634 7.8913 6.84194 7.46738 7.1545 7.15482C7.46706 6.84226 7.89098 6.66666 8.33301 6.66666H31.6663C32.1084 6.66666 32.5323 6.84226 32.8449 7.15482C33.1574 7.46738 33.333 7.8913 33.333 8.33333V10Z"
                      fill="#686868"
                    />
                  </svg>
                  <h1>
                    No Labsheets Available. if you think this is a mistake click
                    refresh.
                  </h1>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default ListEntriesMainAll;

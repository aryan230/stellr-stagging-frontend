import {
  Atom,
  Ban,
  Book,
  Braces,
  CalendarCheck,
  Check,
  CheckCircle,
  Circle,
  CircleDashed,
  Clock10,
  ExternalLink,
  File,
  FileLineChart,
  FileText,
  Folders,
  MoveUpRight,
  Pencil,
  Settings2,
  Table2,
  Tags,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Fragment } from "react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
  InformationCircleIcon,
  LocationMarkerIcon,
  PaperClipIcon,
} from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import moment from "moment";
import _ from "lodash";
import {
  listMyCollabProjects,
  listMyOrgProjects,
  listMyProjects,
} from "../redux/actions/projectActions";
import { listMySamples } from "../redux/actions/sampleActions";
import { listMyProtocols } from "../redux/actions/protocolActions";
import { listMySops } from "../redux/actions/sopActions";
import {
  listMyCollabTasks,
  listMyTasksPersonal,
} from "../redux/actions/taskActions";
import { useDispatch } from "react-redux";
import axios from "axios";
import URL from "./../Data/data.json";
import {
  getUserDetails,
  updateUserProfile,
} from "../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { USER_UPDATE_PROFILE_RESET } from "../redux/constants/userConstants";
import { toast } from "sonner";
import HomeSelectStats from "./HomeSelectStats";
import MainLoader from "./Loaders/MainLoader";

const meetings = [
  {
    id: 1,
    date: "January 10th, 2022",
    time: "5:00 PM",
    datetime: "2022-01-10T17:00",
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    location: "Starbucks",
  },
  // More meetings...
];
const days = [
  { date: "2021-12-27" },
  { date: "2021-12-28" },
  { date: "2021-12-29" },
  { date: "2021-12-30" },
  { date: "2021-12-31" },
  { date: "2022-01-01", isCurrentMonth: true },
  { date: "2022-01-02", isCurrentMonth: true },
  { date: "2022-01-03", isCurrentMonth: true },
  { date: "2022-01-04", isCurrentMonth: true },
  { date: "2022-01-05", isCurrentMonth: true },
  { date: "2022-01-06", isCurrentMonth: true },
  { date: "2022-01-07", isCurrentMonth: true },
  { date: "2022-01-08", isCurrentMonth: true },
  { date: "2022-01-09", isCurrentMonth: true },
  { date: "2022-01-10", isCurrentMonth: true },
  { date: "2022-01-11", isCurrentMonth: true },
  { date: "2022-01-12", isCurrentMonth: true, isToday: true },
  { date: "2022-01-13", isCurrentMonth: true },
  { date: "2022-01-14", isCurrentMonth: true },
  { date: "2022-01-15", isCurrentMonth: true },
  { date: "2022-01-16", isCurrentMonth: true },
  { date: "2022-01-17", isCurrentMonth: true },
  { date: "2022-01-18", isCurrentMonth: true },
  { date: "2022-01-19", isCurrentMonth: true },
  { date: "2022-01-20", isCurrentMonth: true },
  { date: "2022-01-21", isCurrentMonth: true },
  { date: "2022-01-22", isCurrentMonth: true, isSelected: true },
  { date: "2022-01-23", isCurrentMonth: true },
  { date: "2022-01-24", isCurrentMonth: true },
  { date: "2022-01-25", isCurrentMonth: true },
  { date: "2022-01-26", isCurrentMonth: true },
  { date: "2022-01-27", isCurrentMonth: true },
  { date: "2022-01-28", isCurrentMonth: true },
  { date: "2022-01-29", isCurrentMonth: true },
  { date: "2022-01-30", isCurrentMonth: true },
  { date: "2022-01-31", isCurrentMonth: true },
  { date: "2022-02-01" },
  { date: "2022-02-02" },
  { date: "2022-02-03" },
  { date: "2022-02-04" },
  { date: "2022-02-05" },
  { date: "2022-02-06" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NewHomeDash({ setWhichTabisActive }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cd, setCD] = useState();
  const [reports, setReports] = useState();
  const rc = useSelector((state) => state.rc);
  const { rcDetails } = rc;
  const taskListMyPersonal = useSelector((state) => state.taskListMyPersonal);
  const {
    tasksList,
    loading: loadingTasks,
    error: errorTasks,
  } = taskListMyPersonal;
  const taskListMyCollab = useSelector((state) => state.taskListMyCollab);
  const {
    tasks,
    loading: loadingTasksCollab,
    error: errorTasksCollab,
  } = taskListMyCollab;

  let newArr = tasks && tasksList && _.unionBy(tasks, tasksList, "_id");

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

  const userLogin = useSelector((state) => state.userLogin);
  let { loading, error, userInfo } = userLogin;

  //Reports

  useEffect(() => {
    if (userInfo) {
      var config = {
        method: "get",
        url: `${URL}api/reports/myreports`,
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      axios(config)
        .then(function(response) {
          setReports(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }, [userInfo]);

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

  //   Samples

  const sampleListMy = useSelector((state) => state.sampleListMy);
  const {
    samples,
    loading: loadingSamples,
    error: errorSamples,
  } = sampleListMy;

  //Protocols

  const protocolListMy = useSelector((state) => state.protocolListMy);
  const {
    protocols,
    loading: loadingProtocols,
    error: errorProtocols,
  } = protocolListMy;

  const sopListMy = useSelector((state) => state.sopListMy);
  const { sops, loading: loadingSop, error: errorSop } = sopListMy;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { sucess, loading: userUpdateLoading } = userUpdateProfile;

  const userDetails = useSelector((state) => state.userDetails);
  const {
    loading: loadingUserDetails,
    error: errorLoadingDetails,
    sucess: sucessLoadingDetails,
    user,
  } = userDetails;

  useEffect(() => {
    if (userInfo) {
      if (newArrProjects) {
        if (!projectStats) {
          getProjectStats();
        }
      }
    }
  }, [newArrProjects, projectStats, userInfo]);

  //CD

  const getMyCDs = async () => {
    var config = {
      method: "get",
      url: `${URL}api/cd`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    axios(config)
      .then(function(response) {
        console.log(JSON.stringify(response.data));
        setCD(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (userInfo) {
      if (!cd) {
        getMyCDs();
      }
    }
  }, [cd, userInfo]);

  useEffect(() => {
    if (userInfo) {
      dispatch(listMyProjects());
      dispatch(listMyCollabProjects());
      dispatch(listMyOrgProjects());
      dispatch(listMySamples(userInfo._id));
      dispatch(listMyProtocols(userInfo._id));
      dispatch(listMySops(userInfo._id));
    }
  }, [dispatch, userInfo]);

  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);

  console.log(user && user);

  useEffect(() => {
    if (!userInfo) {
      navigate(`/login`);
    } else {
      dispatch(getUserDetails("profile"));
    }
    if (sucess) {
      dispatch(getUserDetails("profile"));
    }
  }, [userInfo, sucess]);

  const submitHandlerProfile = async (data) => {
    setLoader(true);
    const final = JSON.stringify(data);
    await dispatch(updateUserProfile({ home: final }));
    await dispatch({ type: USER_UPDATE_PROFILE_RESET });
    toast.success("Updated Sucessfully");
    setLoader(false);
    setModal(false);
  };

  const finalData = [
    {
      id: "protocols",
      data: protocols && protocols.length,
      name: "Protocols",
      icon: <Book className="mb-2 w-7 h-7 text-slate-500" />,
      onClick: () => {
        setWhichTabisActive("listProtocols");
      },
    },
    {
      id: "samples",
      name: "Samples",
      data: samples && samples.length,
      icon: <Tags className="mb-2 w-7 h-7 text-slate-500" />,
      onClick: () => {
        setWhichTabisActive("sampleList");
      },
    },
    {
      id: "ChemicalDrawings",
      name: "Chemical Drawings",
      data: cd ? cd.length : 0,
      icon: <Atom className="mb-2 w-7 text-slate-500" />,
      onClick: () => {
        setWhichTabisActive("chemicalList");
      },
    },
    {
      id: "SOPs",
      name: "SOPs",
      data: sops && sops.length,
      icon: <FileText className="mb-2 w-7 text-slate-500" />,
      onClick: () => {
        setWhichTabisActive("listSops");
      },
    },
    {
      id: "Reports",
      name: "Reports",
      data: reports && reports.length,
      icon: <FileLineChart className="mb-2 w-7 text-slate-500" />,
      onClick: () => {
        setWhichTabisActive("reportsAndDashboard");
      },
    },
  ];

  return (
    <div className="w-[100%] h-[100%]">
      <HomeSelectStats
        open={modal}
        setOpen={setModal}
        setLoader={setLoader}
        submitHandlerProfile={submitHandlerProfile}
      />
      <div className="w-[95%] mx-auto px-5 pt-3">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setModal(true);
          }}
          className="font-medium text-indigo-600 hover:underline font-body flex items-center justify-left"
        >
          <Settings2 className="mr-2 w-5" />
          Edit dashboard
        </a>
      </div>

      <div className="w-[95%] mx-auto h-[45%] flex items-center justify-center flex-wrap">
        <div className="max-[800px]:w-[100%] w-[40%] h-[100%] p-5">
          <div className="bg-[#5d00d2] w-[100%] h-[100%] rounded-xl relative transition duration-500 hover:scale-95 hover:shadow-2xl">
            <h1 className="text-4xl pl-12 pt-12 font-bold font-[Gotham-Black] text-white">
              Welcome, <br /> {user && user.name}
            </h1>

            <div className="text-white flex pl-12 mt-10 items-center justify-left">
              <Folders className="w-8 mr-4" />
              <p>{newArrProjects && newArrProjects.length} Projects</p>
            </div>

            <div className="text-white flex pl-12 mt-5 items-center justify-left">
              <Circle className="w-8 mr-4" />
              <p>
                {newArr && newArr.filter((t) => t.status === "Open").length}{" "}
                Pending Tasks
              </p>
            </div>
            <div className="text-white flex pl-12 mt-5 items-center justify-left">
              <CheckCircle className="w-8 mr-4" />
              <p>
                {newArr &&
                  newArr.filter((t) => t.status === "Completed").length}{" "}
                Completed Tasks
              </p>
            </div>

            <div
              onClick={(e) => {
                e.preventDefault();
                setWhichTabisActive("projectList");
              }}
              className="absolute flex items-center justify-center w-10 h-10 top-5 right-5 hover:cursor-pointer bg-white rounded-full"
            >
              <MoveUpRight className="w-4" />
            </div>
          </div>
        </div>
        <div className="max-[800px]:hidden w-[60%] h-[100%] p-5 flex-col items-center justify-between">
          <div className="w-[100%] h-[45%] flex">
            <div className="w-[60%] h-[100%] bg-[#4b6cff] rounded-xl mr-5 relative">
              {" "}
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setWhichTabisActive("listEntriesMainAll");
                }}
                className="absolute flex items-center justify-center w-6 h-6 top-5 right-5 hover:cursor-pointer bg-white rounded-full"
              >
                <MoveUpRight className="w-3" />
              </div>
              <h1 className="text-lg pl-5 pt-5 font-bold font-body text-white">
                Lab Entries
              </h1>
              <h1 className="absolute bottom-2 left-5 text-7xl font-body text-white">
                {projectStats &&
                projectStats.filter(
                  (p) =>
                    p.deleted === false && p.type && p.type === "Lab Notebook"
                ).length ? (
                  projectStats.filter(
                    (p) =>
                      p.deleted === false && p.type && p.type === "Lab Notebook"
                  ).length
                ) : (
                  <div aria-label="Loading..." role="status">
                    <svg
                      width={24}
                      height={24}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      xmlns="http://www.w3.org/2000/svg"
                      className="animate-spin w-6 h-6 stroke-white"
                    >
                      <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
                    </svg>
                  </div>
                )}
              </h1>
              <FileText
                size={24}
                strokeWidth={1.5}
                color="#ffffff"
                className="absolute bottom-2 right-5"
              />
            </div>

            <div className="w-[40%] h-[100%] bg-[#1f8a55] rounded-xl relative">
              <h1 className="text-lg pl-5 pt-5 font-bold font-body text-white">
                Lab Sheets
              </h1>
              <h1 className="absolute bottom-2 left-5 text-7xl font-body text-white">
                {projectStats &&
                projectStats.filter(
                  (p) => p.deleted === false && p.type && p.type === "Lab Sheet"
                ).length ? (
                  projectStats &&
                  projectStats.filter(
                    (p) =>
                      p.deleted === false && p.type && p.type === "Lab Sheet"
                  ).length
                ) : (
                  <div aria-label="Loading..." role="status">
                    <svg
                      width={24}
                      height={24}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      xmlns="http://www.w3.org/2000/svg"
                      className="animate-spin w-6 h-6 stroke-white"
                    >
                      <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
                    </svg>
                  </div>
                )}{" "}
              </h1>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setWhichTabisActive("listLabsheets");
                }}
                className="absolute flex items-center justify-center w-6 h-6 top-5 right-5 hover:cursor-pointer bg-white rounded-full"
              >
                <MoveUpRight className="w-3" />
              </div>
              <Table2
                size={24}
                color="#ffffff"
                strokeWidth={1.5}
                className="absolute bottom-2 right-5"
              />
            </div>
          </div>
          <div className="w-[100%] h-[45%] flex items-center justify-between mt-5">
            {user && user.home ? (
              finalData
                .filter((s) => JSON.parse(user.home).some((b) => s.id == b))
                .map((s) => (
                  <div className="w-[30%] h-[100%] bg-indigo-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 relative">
                    <h1 className="text-lg pl-5 pt-5 font-bold font-body text-slate-800">
                      {s.name}
                    </h1>
                    <h1 className="absolute bottom-2 left-5 text-6xl font-body text-slate-700">
                      {s.data}
                    </h1>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        s.onClick();
                      }}
                      className="absolute flex items-center justify-center w-6 h-6 top-5 right-5 hover:cursor-pointer bg-white rounded-full"
                    >
                      <MoveUpRight className="w-3" />
                    </div>
                  </div>
                ))
            ) : (
              <>
                <div className="w-[30%] h-[100%] bg-indigo-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 relative">
                  <h1 className="text-lg pl-5 pt-5 font-bold font-body text-slate-800">
                    Protocols
                  </h1>
                  <h1 className="absolute bottom-2 left-5 text-6xl font-body text-slate-700">
                    {protocols && protocols.length}
                  </h1>
                  <div className="absolute flex items-center justify-center w-6 h-6 top-5 right-5 hover:cursor-pointer bg-white rounded-full">
                    <MoveUpRight className="w-3" />
                  </div>
                </div>
                <div className="w-[30%] h-[100%] bg-indigo-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 relative">
                  <h1 className="text-lg pl-5 pt-5 font-bold font-body text-slate-800">
                    Samples
                  </h1>
                  <h1 className="absolute bottom-2 left-5 text-6xl font-body text-slate-700">
                    {samples && samples.length}
                  </h1>
                  <div className="absolute flex items-center justify-center w-6 h-6 top-5 right-5 hover:cursor-pointer bg-white rounded-full">
                    <MoveUpRight className="w-3" />
                  </div>
                </div>
                <div className="w-[30%] h-[100%] bg-indigo-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100 relative">
                  <h1 className="text-lg pl-5 pt-5 font-bold font-body text-slate-800">
                    SOPs
                  </h1>
                  <h1 className="absolute bottom-2 left-5 text-6xl font-body text-slate-700">
                    {sops && sops.length}
                  </h1>
                  <div className="absolute flex items-center justify-center w-6 h-6 top-5 right-5 hover:cursor-pointer bg-white rounded-full">
                    <MoveUpRight className="w-3" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-[95%] mx-auto h-[50%] mt-3">
        <h3 className="font-sans p-5 text-base font-bold tracking-wide">
          Recently Opened entities{" "}
        </h3>
        <div className="w-[100%] px-5 h-[80%] overflow-y-auto">
          {/* <ul className="divide-y divide-gray-200 font-body">
            <li className="pb-3 sm:pb-4">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex-shrink-0">
                  <Table2 className="w-6 h-6 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Neil Sims
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    email@flowbite.com
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                  $320
                </div>
              </div>
            </li>
          </ul> */}

          {rcDetails && rcDetails.length > 0 ? (
            rcDetails
              .sort(function(a, b) {
                return new Date(b.time) - new Date(a.time);
              })
              .map((r) => (
                // <div className="xl:w-full w-11/12 font-sans mx-auto flex flex-wrap items-center justify-between px-8 mb-2 xl:mb-0 lg:mb-0 border-b border-gray-300">
                //   <div className="xl:w-1/5 py-5">
                //     <div className="flex items-center">
                //       <p className="text-lg text-gray-800 pl-2 font-normal">
                //         {r.name}
                //       </p>
                //     </div>
                //   </div>
                //   <div className="xl:w-1/5 py-5">
                //     <div className="flex items-center">
                //       <svg
                //         xmlns="http://www.w3.org/2000/svg"
                //         className="icon icon-tabler icon-tabler-mail"
                //         width={20}
                //         height={20}
                //         viewBox="0 0 24 24"
                //         strokeWidth="1.5"
                //         stroke="#718096"
                //         fill="none"
                //         strokeLinecap="round"
                //         strokeLinejoin="round"
                //       >
                //         <path stroke="none" d="M0 0h24v24H0z" />
                //         <rect x={3} y={5} width={18} height={14} rx={2} />
                //         <polyline points="3 7 12 13 21 7" />
                //       </svg>
                //       <p className="text-sm text-gray-600 pl-2 font-normal">
                //         {r.type}
                //       </p>
                //     </div>
                //   </div>
                //   <div className="xl:w-1/5 py-5">
                //     <div className="flex items-center">
                //       <svg
                //         xmlns="http://www.w3.org/2000/svg"
                //         className="icon icon-tabler icon-tabler-calendar-event"
                //         width={20}
                //         height={20}
                //         viewBox="0 0 24 24"
                //         strokeWidth="1.5"
                //         stroke="#718096"
                //         fill="none"
                //         strokeLinecap="round"
                //         strokeLinejoin="round"
                //       >
                //         <path stroke="none" d="M0 0h24v24H0z" />
                //         <rect x={4} y={5} width={16} height={16} rx={2} />
                //         <line x1={16} y1={3} x2={16} y2={7} />
                //         <line x1={8} y1={3} x2={8} y2={7} />
                //         <line x1={4} y1={11} x2={20} y2={11} />
                //         <rect x={8} y={15} width={2} height={2} />
                //       </svg>
                //       <p className="text-sm text-gray-600 pl-2 font-normal">
                //         {moment(r.time).fromNow()}
                //       </p>
                //     </div>
                //   </div>
                //   <div className="xl:w-1/5 py-5">
                //     <div className="flex items-center">
                //       <svg
                //         xmlns="http://www.w3.org/2000/svg"
                //         viewBox="0 0 24 24"
                //         width={20}
                //         height={20}
                //         fill="#68D391"
                //       >
                //         <path
                //           className="heroicon-ui"
                //           d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2.3-8.7l1.3 1.29 3.3-3.3a1 1 0 0 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-2-2a1 1 0 0 1 1.4-1.42z"
                //         />
                //       </svg>
                //       <p className="text-sm text-gray-600 pl-2 font-normal">
                //         Completed Profile Screening
                //       </p>
                //     </div>
                //   </div>
                // </div>
                // <div className="rounded-md bg-blue-50 p-4 font-body mb-3">
                //   <div className="flex">
                //     <div className="flex-shrink-0">
                //       <Table2
                //         className="h-5 w-5 text-blue-400"
                //         aria-hidden="true"
                //       />
                //     </div>
                //     <div className="ml-3 flex-1 md:flex md:justify-between">
                //       <p className="text-sm text-blue-700">
                //         {r.name} (
                //         {moment(r.time).format("l") +
                //           " " +
                //           moment(r.time).format("LT")}
                //         )
                //       </p>
                //       <p className="mt-3 text-sm md:mt-0 md:ml-6">
                //         <a
                //           href="#"
                //           className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                //         >
                //           Details <span aria-hidden="true">&rarr;</span>
                //         </a>
                //       </p>
                //     </div>
                //   </div>
                // </div>
                <div
                  id="marketing-banner"
                  tabIndex={-1}
                  className="z-50 mb-2 font-sans flex flex-col md:flex-row justify-between w-[calc(100%-2rem)] p-4 bg-indigo-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100"
                >
                  <div className="flex flex-col items-start mb-3 me-4 md:items-center md:flex-row md:mb-0">
                    <a
                      href="#"
                      className="flex items-center mb-2 border-gray-200 md:pe-4 md:me-4 md:border-e md:mb-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-500 me-3 flex items-center justify-center">
                        {" "}
                        {r.type === "Project" && (
                          <Folders className="h-4 text-white" />
                        )}
                        {r.type === "Lab Sheet" && (
                          <Table2 className="h-4 text-white" />
                        )}
                        {r.type === "Lab Entry" && (
                          <FileText className="h-4 text-white" />
                        )}
                        {r.type === "Task" && (
                          <CheckCircle className="h-4 text-white" />
                        )}
                        {r.type === "Chemical Drawing" && (
                          <Atom className="h-4 text-white" />
                        )}
                        {r.type === "SOP" && (
                          <File className="h-4 text-white" />
                        )}
                        {r.type === "Protocol" && (
                          <Book className="h-4 text-white" />
                        )}
                      </div>

                      <span className="self-center text-base font-semibold whitespace-nowrap">
                        {r.name}{" "}
                      </span>
                    </a>
                    <p className="flex items-center text-sm font-normal text-gray-500">
                      {r.type}
                    </p>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <a
                      href="#"
                      className="px-5 py-2 me-2 text-xs font-medium text-indigo-600 rounded-lg"
                    >
                      {moment(r.time).fromNow()}
                    </a>
                  </div>
                </div>
              ))
          ) : (
            <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png"
                alt=""
                className="w-32 mb-2"
              />
              <br />
              <h2 className="font-body">
                You have no recently opened entities.
              </h2>
            </div>
          )}
          {/* <div>
            <div className="">
              <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
                {rcDetails
                  .sort(function(a, b) {
                    return new Date(b.time) - new Date(a.time);
                  })
                  .map((meeting) => (
                    <li
                      key={meeting._id}
                      className="relative flex space-x-6 py-6 xl:static"
                    >
                      <Table2 className="h-14 w-14 p-2 flex-none" />
                      <div className="flex-auto">
                        <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
                          {meeting.name}
                        </h3>
                        <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
                          <div className="flex items-start space-x-3">
                            <dt className="mt-0.5">
                              <span className="sr-only">Date</span>
                              <CalendarIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </dt>
                            <dd>
                              <time dateTime={meeting.datetime}>
                                {meeting.date} at {meeting.time}
                              </time>
                            </dd>
                          </div>
                          <div className="mt-2 flex items-start space-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                            <dt className="mt-0.5">
                              <span className="sr-only">ID</span>
                              <Braces
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </dt>
                            <dd>{meeting._id}</dd>
                          </div>
                        </dl>
                      </div>
                      <Menu
                        as="div"
                        className="absolute top-6 right-0 xl:relative xl:top-auto xl:right-auto xl:self-center"
                      >
                        <div>
                          <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
                            <span className="sr-only">Open options</span>
                            <DotsHorizontalIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="focus:outline-none absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    Edit
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    Cancel
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </li>
                  ))}
              </ol>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default NewHomeDash;

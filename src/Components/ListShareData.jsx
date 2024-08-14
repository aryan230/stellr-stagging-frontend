import React, { useEffect } from "react";
import URL from "./../Data/data.json";
import axios from "axios";
import { useSelector } from "react-redux";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MenuIcon,
  UsersIcon,
  XIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ScaleIcon,
} from "@heroicons/react/outline";
import {
  OfficeBuildingIcon,
  CheckCircleIcon,
  CashIcon,
  ChevronRightIcon,
} from "@heroicons/react/solid";
import {
  Atom,
  Book,
  BookIcon,
  BookMinus,
  Check,
  Circle,
  Database,
  File,
  FileText,
  Folders,
  FoldersIcon,
  MessageSquare,
  MoveUpRight,
  Table2,
  Table2Icon,
  Tag,
} from "lucide-react";
import CompleteLoader from "./Loaders/CompleteLoader";
import MainLoader from "./Loaders/MainLoader";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  listMyCollabOrgs,
  listMyOrgs,
} from "../redux/actions/organizationActions";
import { getUserDetails } from "../redux/actions/userActions";
import { addTime } from "./Functions/addTime";
import { userAvatar } from "./Functions/userAvatar";
import ListShareHeader from "./ListShareHeader";
import PaginationOne from "./ShareData/PaginationOne";
import PageMain from "./ShareData/PageMain";
import ListOrgEntities from "./ListOrgEntities";
import { toast } from "sonner";
import { addToState } from "../redux/actions/stateActions";
import { addToCart } from "../redux/actions/cartActions";
import NewSpreadSheet from "./Modals/NewSpreadSheet";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Lab Entries", href: "#", icon: File, current: false },
  { name: "Lab Sheets", href: "#", icon: Table2, current: false },
  { name: "Protocols", href: "#", icon: BookIcon, current: false },
  { name: "SOPs", href: "#", icon: FileText, current: false },
  { name: "Samples", href: "#", icon: Tag, current: false },
  { name: "Tasks", href: "#", icon: Check, current: false },
  { name: "Chemical Drawings", href: "#", icon: Atom, current: false },
  { name: "Reports", href: "#", icon: ChartBarIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ListShareData({
  setWhichTabisActive,
  setProtocolContent,
  setProtocolModal,
  setSopModal,
  setSopContent,
  setTabId,
  setTaskContent,
  setTaskModal,
  setSampleContent,
  setSampleModal,
  setCDModalContent,
  setCDModal,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [todaysDate, setTodaysDate] = useState();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loaderText, setLoaderText] = useState();
  const [orgStatusContent, setOrgStatusContent] = useState();
  const [orgContent, setOrgContent] = useState();
  const [nav, setNav] = useState(0);
  const [isSpreadSheetOpen, setIsSpreadSheetOpen] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState({});
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orgListMy = useSelector((state) => state.orgListMy);
  const { loading: loading, error: error, sucess: sucess, orgs } = orgListMy;

  const orgListMyCollab = useSelector((state) => state.orgListMyCollab);
  const { sucess: sucessCollab, orgs: orgsCollab } = orgListMyCollab;

  const findOrg =
    orgs && orgs.length > 0
      ? orgs[0]
      : orgsCollab && orgsCollab.length > 0
      ? orgsCollab[0]
      : null;

  const findOrgRole =
    orgs && orgs.length > 0
      ? orgs[0].user == userInfo._id && "Owner"
      : orgsCollab && orgsCollab.length > 0
      ? orgsCollab[0].collaborators.find((e) => e.user == userInfo._id) &&
        orgsCollab[0].collaborators.find((e) => e.user == userInfo._id)
          .permissions
      : null;

  const [pStats, setPStats] = useState(false);
  const getPstats = async () => {
    const proData = await JSON.stringify({
      projectId: orgContent.orgData
        .map((u) => {
          return u.projects;
        })
        .flat(1)
        .map((p) => ({
          _id: p._id,
          name: p.name,
        })),
    });

    var config = {
      method: "post",
      url: `${URL}api/projects/entry-data`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: proData,
    };

    axios(config)
      .then(function(response) {
        console.log(response.data);
        let entriesArray = [];
        response.data.stats.map((e) => {
          e.entries.map((p) => {
            p.projectName = e.name;
            entriesArray.push(p);
          });
        });
        setPStats(entriesArray);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (orgContent) {
      if (!pStats) {
        getPstats();
      }
    }
  }, [orgContent]);

  const getProjectStats = async () => {
    setLoader(true);
    var data = JSON.stringify({
      orgId: findOrg._id,
    });

    var config = {
      method: "post",
      url: `${URL}api/organs/orgData`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function(response) {
        console.log(response.data);
        setOrgContent(response.data);
        setLoader(false);
      })
      .catch(function(error) {
        setLoader(false);
        console.log(error);
      });
  };

  useEffect(() => {
    dispatch(listMyOrgs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUserDetails("profile"));
  }, [dispatch]);
  useEffect(() => {
    dispatch(listMyCollabOrgs());
  }, [dispatch]);

  useEffect(() => {
    if (!orgContent) {
      if (findOrg) {
        getProjectStats();
      }
    }
  }, [findOrg, orgContent]);

  //data

  let finalCountProtocol = "a";

  let finalCountSOP =
    orgContent &&
    orgContent.orgData &&
    orgContent.orgData
      .map((u) => {
        return u.sops.length;
      })

      .reduce((partialSum, a) => partialSum + a, 0);

  const cards = [
    {
      name: "SOP",
      href: "#",
      icon: FileText,
      id: 6,
      amount:
        orgContent &&
        orgContent.orgData &&
        orgContent.orgData
          .map((u) => {
            return u.sops.length;
          })
          .reduce((partialSum, a) => partialSum + a, 0) ? (
          orgContent &&
          orgContent.orgData &&
          orgContent.orgData
            .map((u) => {
              return u.sops.length;
            })
            .reduce((partialSum, a) => partialSum + a, 0)
        ) : (
          <div aria-label="Loading..." role="status" className="mt-2">
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
              className="animate-spin w-6 h-6 stroke-black"
            >
              <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
            </svg>
          </div>
        ),
    },
    {
      name: "Projects",
      href: "#",
      id: 1,
      icon: Folders,
      amount:
        orgContent &&
        orgContent.orgData &&
        orgContent.orgData
          .map((u) => {
            return u.projects.length;
          })
          .reduce((partialSum, a) => partialSum + a, 0) ? (
          orgContent &&
          orgContent.orgData &&
          orgContent.orgData
            .map((u) => {
              return u.projects.length;
            })
            .reduce((partialSum, a) => partialSum + a, 0)
        ) : (
          <div aria-label="Loading..." role="status" className="mt-2">
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
              className="animate-spin w-6 h-6 stroke-black"
            >
              <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
            </svg>
          </div>
        ),
    },
    {
      name: "Protocols",
      href: "#",
      icon: Book,
      id: 5,
      amount:
        orgContent &&
        orgContent.orgData &&
        orgContent.orgData
          .map((u) => {
            return u.protocols.length;
          })
          .reduce((partialSum, a) => partialSum + a, 0) ? (
          orgContent &&
          orgContent.orgData &&
          orgContent.orgData
            .map((u) => {
              return u.protocols.length;
            })
            .reduce((partialSum, a) => partialSum + a, 0)
        ) : (
          <div aria-label="Loading..." role="status" className="mt-2">
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
              className="animate-spin w-6 h-6 stroke-black"
            >
              <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
            </svg>
          </div>
        ),
    },
    {
      name: "Chemical Drawings",
      href: "#",
      id: 9,
      icon: Atom,
      amount:
        orgContent &&
        orgContent.orgData &&
        orgContent.orgData
          .map((u) => {
            return u.cd.length;
          })
          .reduce((partialSum, a) => partialSum + a, 0) ? (
          orgContent &&
          orgContent.orgData &&
          orgContent.orgData
            .map((u) => {
              return u.cd.length;
            })
            .reduce((partialSum, a) => partialSum + a, 0)
        ) : (
          <div aria-label="Loading..." role="status" className="mt-2">
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
              className="animate-spin w-6 h-6 stroke-black"
            >
              <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
            </svg>
          </div>
        ),
    },
    {
      id: 4,
      name: "Lab Sheets",
      href: "#",
      icon: Table2,
      amount: pStats ? (
        pStats.filter((e) => e.type === "Lab Sheet").length
      ) : (
        <div aria-label="Loading..." role="status" className="mt-2">
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
            className="animate-spin w-6 h-6 stroke-black"
          >
            <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
          </svg>
        </div>
      ),
    },
  ];

  const getEventProp = (event, start, end, isSelected) => {
    if (event.typeEvent === "normal") {
      var backgroundColor = "#" + event.hexColor;
      var style = {
        backgroundColor: "#6c63ff",
        borderRadius: "4px",
        opacity: 1,
        fontFamily: "Poppins",
        fontSize: "12px",
        color: "white",
        border: "0px",
        display: "block",
        boxShadow:
          "0px 6px 10px 0px rgba(0,0,0,.14), 0px 1px 18px 0px rgba(0,0,0,.12), 0px 3px 5px -1px rgba(0,0,0,.2)",
      };
      return {
        style: style,
      };
    } else {
      var backgroundColor = "#" + event.hexColor;
      var style = {
        backgroundColor: "#6200d2",
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      };
      return {
        style: style,
      };
    }
  };
  const handleSelected = (event) => {
    const doc = {
      subject: event.title,
      due_date: event.end.toISOString().split("T")[0],
      assigned: event.assigned,
      createdAt: event.start.toISOString().split("T")[0],
      status: event.status,
      priority: event.priority,
      project: event.project,
      user: event.user,
      _id: event._id,
    };
    toast.error("There was an error");
  };
  const showEntity = async (type, data) => {
    switch (type) {
      case "protocols":
        setProtocolContent(data);
        setProtocolModal(true);
        break;
      case "sops":
        setSopContent(data);
        setSopModal(true);
        break;
      case "tasks":
        setTaskContent(data);
        setTaskModal(true);
        break;
      case "samples":
        setSampleContent(data);
        setSampleModal(true);
        break;
      case "entries":
        {
          if (data.type === "Lab Sheet") {
            setSpreadsheetData({
              id: data._id,
              name: data.name,
              doc: data,
            });
            setIsSpreadSheetOpen(true);
          } else {
            await dispatch(addToState(`tabs#${data._id}`));
            await dispatch(
              addToCart({
                doc: data,
                project: data.project,
                userType: data.access === "view" ? "Read" : "Admin",
              })
            );
            setTabId(data._id);
            setWhichTabisActive("tabs");
          }
        }
        break;
      case "reports":
        setProtocolContent(data);
        setProtocolModal(true);
        break;
      case "cd":
        setCDModalContent(data);
        setCDModal(true);
        break;
      case "projects":
        break;
    }
  };

  const openAnEntity = async (type, entity) => {
    setLoader(true);
    if (entity.user === userInfo._id) {
      setLoader(false);
      showEntity(type, entity);
    } else if (entity.share) {
      if (JSON.parse(entity.share)) {
        const share = JSON.parse(entity.share);
        if (share.users) {
          const check = await share.users.find((u) => u.user === userInfo._id);
          if (check) {
            if (check.expiry) {
              if (addTime(check.expiry) >= addTime(Date.now())) {
                setLoader(false);
                entity.access = check.access;
                showEntity(type, entity);
              } else {
                setLoader(false);
                toast.error(
                  `Your permissions to access this entity has expired ${moment(
                    check.expiry
                  ).fromNow()}`
                );
              }
            } else if (check.events) {
              let event = check.events[0];
              if (event) {
                if (event.filter) {
                  if (event.filter.condition == "equals") {
                    if (entity[event.filter.field] === event.filter.value) {
                      setLoader(false);
                      entity.access = check.access;
                      showEntity(type, entity);
                    } else {
                      setLoader(false);
                      toast.error("You can't access this entity(1)");
                    }
                  } else if (event.filter.condition == "contains") {
                    if (
                      entity[event.fields[0].value]
                        .toLowerCase()
                        .includes(event.filter.value.toLowerCase())
                    ) {
                      setLoader(false);
                      entity.access = check.access;
                      showEntity(type, entity);
                    } else {
                      setLoader(false);
                      toast.error("You can't access this entity(2)");
                    }
                  } else {
                    toast.error(entity[event.fields[0].value]);
                  }
                }
              }
            } else {
              setLoader(false);
              entity.access = check.access;
              showEntity(type, entity);
            }
          } else {
            setLoader(false);
            toast.error("You dont have permission to access this entity (1).");
          }
        } else {
          setLoader(false);
          toast.error("You dont have permission to access this entity (2).");
        }
      } else {
        setLoader(false);
        toast.error("You dont have permission to access this entity (3).");
      }
    } else {
      setLoader(false);
      toast.error("You dont have permission to access this entity (4).");
    }
  };
  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    setLoader(true);
    window.setTimeout(() => {
      setLoader(false);
    }, randomInteger(1000, 5000));
  }, [nav]);

  return (
    <div className="w-[100%] h-[100%] flex items-center justify-center font-dmsans">
      {isSpreadSheetOpen && (
        <NewSpreadSheet
          spreadsheetData={spreadsheetData}
          setIsSpreadSheetOpen={setIsSpreadSheetOpen}
        />
      )}{" "}
      <div className="w-[98%] bg-white shadow-lg h-[92%] mx-auto relative">
        <div className="h-[100%]">
          <div className="h-[100%]">
            <Transition.Root show={sidebarOpen} as={Fragment}>
              <Dialog
                as="div"
                className="absolute inset-0 flex z-40 md:hidden"
                onClose={setSidebarOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="absolute inset-0 bg-gray-600 bg-opacity-75" />
                </Transition.Child>
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                          type="button"
                          className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                      <nav className="mt-5 px-2 space-y-1">
                        {navigation.map((item, index) => (
                          <a
                            key={item.name}
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault();
                              setNav(index);
                            }}
                            className={classNames(
                              item.current
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                              "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                nav === index
                                  ? "text-gray-500"
                                  : "text-gray-400 group-hover:text-gray-500",
                                "mr-4 flex-shrink-0 h-6 w-6"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                      <a href="#" className="flex-shrink-0 group block">
                        <div className="flex items-center">
                          <div>
                            <img
                              className="inline-block h-10 w-10 rounded-full"
                              src={userAvatar(userInfo && userInfo.name)}
                              alt=""
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                              {userInfo && userInfo.name}
                            </p>
                            <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                              View profile
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 w-14">
                  {/* Force sidebar to shrink to fit close icon */}
                </div>
              </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col md:absolute md:inset-y-0">
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                  <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                    {navigation.map((item, index) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          setNav(index);
                        }}
                        className={classNames(
                          nav === index
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-3 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                  <a href="#" className="flex-shrink-0 w-full group block">
                    <div className="flex items-center">
                      <div>
                        <img
                          className="inline-block h-9 w-9 rounded-full"
                          src={userInfo && userAvatar(userInfo.name)}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {userInfo && userInfo.name}
                        </p>
                        <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                          {userInfo && userInfo.email}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="md:pl-64 flex flex-col flex-1 h-[100%]">
              {loader && <MainLoader text={loaderText && loaderText} />}
              <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
                <button
                  type="button"
                  className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <main className="flex-1 relative h-[90%] overflow-y-auto">
                <div className="py-6">
                  {orgContent ? (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                      {nav === 0 && (
                        <main className="flex-1 pb-8">
                          {/* Page header */}
                          <div className="bg-white shadow sticky top-0">
                            <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
                              <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                                <div className="flex-1 min-w-0">
                                  {/* Profile */}
                                  <div className="flex items-center">
                                    <img
                                      className="hidden h-16 w-16 rounded-full sm:block"
                                      src={
                                        userInfo && userAvatar(userInfo.name)
                                      }
                                      alt=""
                                    />
                                    <div>
                                      <div className="flex items-center">
                                        <img
                                          className="h-16 w-16 rounded-full sm:hidden"
                                          src={userAvatar(
                                            userInfo && userInfo.name
                                          )}
                                          alt=""
                                        />
                                        <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                                          Welcome, {userInfo && userInfo.name}
                                        </h1>
                                      </div>
                                      <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                        <dt className="sr-only">Company</dt>
                                        <dd className="flex items-center text-sm text-gray-500 font-medium capitalize sm:mr-6">
                                          <OfficeBuildingIcon
                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                          />
                                          {findOrg && findOrg.name}
                                        </dd>
                                        <dt className="sr-only">
                                          Account status
                                        </dt>
                                        <dd className="mt-3 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                                          <CheckCircleIcon
                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                                            aria-hidden="true"
                                          />
                                          {findOrgRole && findOrgRole}
                                        </dd>
                                      </dl>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      setWhichTabisActive("orgList");
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    View Settings
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-8">
                            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                              <h2 className="text-lg leading-6 font-medium text-gray-900">
                                Overview
                              </h2>
                              <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Card */}
                                {cards.map((card) => (
                                  <div
                                    key={card.name}
                                    className="bg-white overflow-hidden shadow rounded-lg"
                                  >
                                    <div className="p-5">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                          <card.icon
                                            className="h-6 w-6 text-gray-400"
                                            aria-hidden="true"
                                          />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                          <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                              {card.name}
                                            </dt>
                                            <dd>
                                              <div className="text-lg font-medium text-gray-900">
                                                {card.amount}
                                              </div>
                                            </dd>
                                          </dl>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-gray-50 px-5 py-3">
                                      <div className="text-sm">
                                        <a
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setNav(card.id);
                                          }}
                                          className="font-medium text-indigo-700 hover:text-indigo-900"
                                        >
                                          View all
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
                              Recent activity
                            </h2>

                            {/* Activity list (smallest breakpoint only) */}
                            <div className="shadow sm:hidden">
                              <ul
                                role="list"
                                className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden"
                              >
                                {findOrg &&
                                  findOrg.logs
                                    .sort(function(a, b) {
                                      return (
                                        new Date(b.date) - new Date(a.date)
                                      );
                                    })
                                    .map((transaction) => (
                                      <li key={transaction.date}>
                                        <a
                                          href="#"
                                          className="block px-4 py-4 bg-white hover:bg-gray-50"
                                        >
                                          <span className="flex items-center space-x-4">
                                            <span className="flex-1 flex space-x-2 truncate">
                                              <CashIcon
                                                className="flex-shrink-0 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                              />
                                              <span className="flex flex-col text-gray-500 text-sm truncate">
                                                <span className="truncate">
                                                  {transaction.date}
                                                </span>
                                                <span>
                                                  <span className="text-gray-900 font-medium">
                                                    {transaction.date}
                                                  </span>{" "}
                                                  {transaction.date}
                                                </span>
                                                <time
                                                  dateTime={transaction.date}
                                                >
                                                  {transaction.date}
                                                </time>
                                              </span>
                                            </span>
                                            <ChevronRightIcon
                                              className="flex-shrink-0 h-5 w-5 text-gray-400"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </a>
                                      </li>
                                    ))}
                              </ul>
                            </div>

                            <div className="hidden sm:block">
                              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex flex-col mt-2">
                                  <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead>
                                        <tr>
                                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Message
                                          </th>
                                          <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                          </th>

                                          <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                        {findOrg &&
                                          findOrg.logs.map((transaction) => (
                                            <tr
                                              key={transaction.date}
                                              className="bg-white"
                                            >
                                              <td className="max-w-0 w-full px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex">
                                                  <a
                                                    href={transaction.date}
                                                    className="group inline-flex space-x-2 truncate text-sm"
                                                  >
                                                    <MessageSquare
                                                      className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                      aria-hidden="true"
                                                    />
                                                    <p className="text-gray-500 truncate group-hover:text-gray-900">
                                                      {transaction.message}
                                                    </p>
                                                  </a>
                                                </div>
                                              </td>
                                              <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                                                <span className="text-gray-900 font-medium">
                                                  {transaction.userName}{" "}
                                                </span>
                                              </td>

                                              <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                                                <time
                                                  dateTime={transaction.date}
                                                >
                                                  {addTime(transaction.date)}
                                                </time>
                                              </td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </main>
                      )}
                      {nav === 1 && (
                        <main className="w-full h-full">
                          <ListShareHeader
                            name="Projects"
                            nav="projects"
                            setNav={setNav}
                          />

                          <div className="w-full h-[80vh]">
                            <PageMain
                              data={orgContent.orgData
                                .map((u) => {
                                  return u.projects;
                                })
                                .flat(1)
                                .map((p) => ({
                                  _id: p._id,
                                  name: p.name,
                                  createdAt: p.createdAt,
                                  updatedAt: p.updatedAt,
                                  data: p,
                                }))}
                              icon={
                                <FoldersIcon className="w-5 h-5 text-indigo-600 mr-3" />
                              }
                              type="projects"
                              openAnEntity={() => {
                                setLoader(true);
                                window.setTimeout(() => {
                                  setLoader(false);
                                  toast.error("There was an error");
                                }, 3000);
                              }}
                            />
                          </div>
                        </main>
                      )}
                      {nav === 2 && (
                        <main className="w-full h-full">
                          <ListShareHeader
                            name="Calendar"
                            nav="projects"
                            setNav={setNav}
                          />
                          <div className="w-full mx-auto h-[80vh] flex flex-col items-center justify-center">
                            {" "}
                            <Calendar
                              views={{
                                month: true,
                                week: false,
                                day: false,
                                agenda: false,
                              }}
                              localizer={localizer}
                              defaultDate={new Date()}
                              defaultView="month"
                              events={
                                orgContent.orgData &&
                                orgContent.orgData
                                  .map((u) => {
                                    return u.tasks;
                                  })
                                  .flat(1)
                                  .filter((t) => t.deleted === false)
                                  .map(
                                    ({
                                      subject: title,
                                      due_date: start,
                                      due_date: end,
                                      ...rest
                                    }) => ({
                                      title,
                                      start: new Date(start),
                                      end: new Date(end),
                                      allDay: true,
                                      typeEvent: "normal",
                                      ...rest,
                                    })
                                  )
                              }
                              eventPropGetter={getEventProp}
                              style={{ height: "100%", width: "100%" }}
                              onSelectEvent={handleSelected}
                            />
                          </div>
                        </main>
                      )}
                      {nav === 3 && (
                        <main className="w-full h-full">
                          <ListShareHeader name="Lab Entries" setNav={setNav} />

                          <div className="w-full h-[80vh]">
                            <PageMain
                              data={
                                pStats
                                  ? pStats.filter(
                                      (e) => e.type === "Lab Notebook"
                                    )
                                  : []
                              }
                              icon={
                                <File className="w-5 h-5 text-indigo-600 mr-2" />
                              }
                              extra={[
                                {
                                  name: "Project",
                                  slug: "projectName",
                                },
                              ]}
                              type="entries"
                              openAnEntity={openAnEntity}
                            />
                          </div>
                        </main>
                      )}
                      {nav === 4 && (
                        <main className="w-full h-full">
                          <ListShareHeader name="Lab Sheets" setNav={setNav} />

                          <div className="w-full h-[80vh]">
                            <PageMain
                              data={
                                pStats
                                  ? pStats.filter((e) => e.type === "Lab Sheet")
                                  : []
                              }
                              extra={[
                                {
                                  name: "Project",
                                  slug: "projectName",
                                },
                              ]}
                              icon={
                                <Table2Icon className="w-5 h-5 text-green-600 mr-2" />
                              }
                              type="entries"
                              openAnEntity={openAnEntity}
                            />
                          </div>
                        </main>
                      )}
                      {nav === 5 && (
                        <main className="w-full h-full">
                          <ListShareHeader name="Protocols" setNav={setNav} />

                          <div className="w-full h-[80vh]">
                            <PageMain
                              data={orgContent.orgData
                                .map((u) => {
                                  return u.protocols.map(({ ...rest }) => ({
                                    ownerName: u.name,
                                    ...rest,
                                  }));
                                })
                                .flat(1)
                                .map((p) => ({
                                  _id: p._id,
                                  name: p.title,
                                  createdAt: p.createdAt,
                                  updatedAt: p.updatedAt,
                                  data: p,
                                  ownerName: p.ownerName,
                                }))}
                              type="protocols"
                              icon={
                                <Book className="w-5 h-5 text-indigo-600 mr-2" />
                              }
                              openAnEntity={openAnEntity}
                            />
                          </div>
                        </main>
                      )}
                      {nav === 6 && (
                        <main className="w-full h-full">
                          <ListShareHeader name="SOPs" setNav={setNav} />

                          <div className="w-full h-[80vh]">
                            <PageMain
                              data={orgContent.orgData
                                .map((u) => {
                                  return u.sops.map(({ ...rest }) => ({
                                    ownerName: u.name,
                                    ...rest,
                                  }));
                                })
                                .flat(1)
                                .map((p) => ({
                                  _id: p._id,
                                  name: p.title,
                                  createdAt: p.createdAt,
                                  updatedAt: p.updatedAt,
                                  data: p,
                                  ownerName: p.ownerName,
                                }))}
                              type="sops"
                              icon={
                                <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                              }
                              openAnEntity={openAnEntity}
                            />
                          </div>
                        </main>
                      )}
                      {nav === 7 && (
                        <main className="w-full h-full">
                          <ListShareHeader name="Samples" setNav={setNav} />

                          <div className="w-full h-[80vh]">
                            <PageMain
                              data={orgContent.orgData
                                .map((u) => {
                                  return u.samples.map(({ ...rest }) => ({
                                    ownerName: u.name,
                                    ...rest,
                                  }));
                                })
                                .flat(1)
                                .map((p) => ({
                                  _id: p._id,
                                  name: JSON.parse(p.data).sampleName,
                                  createdAt: p.createdAt,
                                  updatedAt: p.updatedAt,
                                  data: p,
                                  ownerName: p.ownerName,
                                }))}
                              type="samples"
                              openAnEntity={openAnEntity}
                            />
                          </div>
                        </main>
                      )}
                      {nav === 8 && (
                        <main className="w-full h-full">
                          <ListShareHeader
                            name="Tasks"
                            nav="tasks"
                            setNav={setNav}
                          />
                          <div className="w-[80%] mx-auto h-[80vh] flex flex-col items-center justify-center">
                            {" "}
                            <img
                              src="./assets/task.svg"
                              alt=""
                              className="w-[30%]"
                            />
                            <p className="mt-5">
                              There was an error loading data. Please check back
                              later.
                            </p>
                          </div>
                        </main>
                      )}
                      {nav === 9 && (
                        <main className="w-full h-full">
                          <ListShareHeader
                            name="Chemical Drawings"
                            setNav={setNav}
                          />

                          <div className="w-full h-[80vh]">
                            <PageMain
                              data={orgContent.orgData
                                .map((u) => {
                                  return u.cd.map(({ ...rest }) => ({
                                    ownerName: u.name,
                                    ...rest,
                                  }));
                                })
                                .flat(1)
                                .map((p) => ({
                                  _id: p._id,
                                  name: p.name,
                                  createdAt: p.createdAt,
                                  updatedAt: p.updatedAt,
                                  ownerName: p.ownerName,
                                  data: p,
                                }))}
                              type="cd"
                              extra={[
                                {
                                  name: "Created by",
                                  slug: "ownerName",
                                },
                              ]}
                              openAnEntity={openAnEntity}
                            />
                          </div>
                        </main>
                      )}
                      {nav === 10 && (
                        <main className="w-full h-full">
                          <ListShareHeader
                            name="Reports"
                            nav="reports"
                            setNav={setNav}
                          />
                          <div className="w-[80%] mx-auto h-[80vh] flex flex-col items-center justify-center">
                            {" "}
                            <img
                              src="./assets/task.svg"
                              alt=""
                              className="w-[30%]"
                            />
                            <p className="mt-5">
                              There was an error loading data. Please check back
                              later.
                            </p>
                          </div>
                        </main>
                      )}
                    </div>
                  ) : (
                    <CompleteLoader />
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListShareData;

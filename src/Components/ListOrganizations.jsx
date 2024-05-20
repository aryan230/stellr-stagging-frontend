import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  listMyCollabOrgs,
  listMyOrgs,
} from "../redux/actions/organizationActions";
import { getUserDetails } from "../redux/actions/userActions";
import OrgnizationSettings from "./OrganizationSettings/OrgnizationSettings";
import { Helmet } from "react-helmet";
import axios from "axios";
import URL from "./../Data/data.json";
import OrganizationStatusModal from "./OrganizationSettings/OrganizationStatusModal";
import { addProtocolLogs } from "./Functions/addProtocolLogs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { addSOPLogs } from "./Functions/addSOPLogs";
import { addNotification } from "./Functions/addNotification";
import { PaperClipIcon, PlusIcon } from "@heroicons/react/solid";

import { Disclosure, Menu, Switch, Transition } from "@headlessui/react";

import { toast } from "sonner";
import { SearchIcon } from "@heroicons/react/solid";
import {
  BellIcon,
  CogIcon,
  CreditCardIcon,
  KeyIcon,
  MenuIcon,
  UserCircleIcon,
  ViewGridAddIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  Ban,
  Building,
  CheckCircle2,
  Clipboard,
  Copy,
  Database,
  ExternalLink,
  FileText,
  Fingerprint,
  HardDrive,
  Key,
  LogOut,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import LeaveOrganization from "./OrganizationSettings/LeaveOrganization";
import OrgSettingsModal from "./OrganizationSettings/OrgSettingsModal";
import { addTime } from "./Functions/addTime";
import MainLoader from "./Loaders/MainLoader";
import CompleteLoader from "./Loaders/CompleteLoader";
import SpinnerLoader from "./Loaders/SpinnerLoader";
import SecondInsideLoader from "./Loader/SecondInsideLoader";
import InsideLoader from "./Loader/InsideLoader";
import SecondLoaderWithText from "./Loaders/SecondLoaderWithText";
import { addOrgLogs } from "./Functions/addOrgLogs";
import LogsModal from "./Logs/LogsModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ListOrganizations({
  newOrg,
  setUpdatedUserCollabRoleOrg,
  UpdatedUserCollabRoleOrg,
  setProtocolContent,
  setProtocolModal,
  setSopContent,
  setSopModal,
  setWhichTabisActive,
  setCreateOrg,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orgSettings, setOrgSettings] = useState(false);
  const [orgStatusContent, setOrgStatusContent] = useState();
  const [changeStatus, setOrgStatus] = useState(false);
  const [orgContent, setOrgContent] = useState();
  const [orgContentSettings, setOrgContentSettings] = useState();
  const [inputSearch, setInputSearch] = useState("");
  const [eType, setEType] = useState();
  const [newCollab, setNewCollab] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  const [updateCollabRole, setUpdateCollabRole] = useState(false);
  const { userInfo } = userLogin;
  const [newAccountName, setNewAccountName] = useState();
  const userDetails = useSelector((state) => state.userDetails);
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = useState();
  const [rowsPerPage, setRowsPerPage] = React.useState(4);
  const [ownerUserData, setOwnerUserData] = useState();
  const [leaveOrg, setLeaveOrg] = useState(false);
  const [email, setEmail] = useState();
  const [activeSub, setActiveSub] = useState(1);
  const [settingsModal, setSettingsModal] = useState(false);
  const [updateUserId, setUpdateUserId] = useState();
  const [loader, setLoader] = useState(false);
  const [logs, setLogs] = useState(false);

  const roleOptions = [
    {
      value: "Lab Member",
      label: "Lab Member",
      permissions: "Read",
    },
    {
      value: "Lab Manager",
      label: "Lab Manager",
      permissions: "Admin",
    },
    {
      value: "Data Analyst",
      label: "Data Analyst",
      permissions: "Admin",
    },
    {
      value: "Data Scientist",
      label: "Data Scientist",
      permissions: "Admin",
    },
    {
      value: "Compliance Officer",
      label: "Compliance Officer",
      permissions: "Admin",
    },
    { value: "Project Lead", label: "Project Lead", permissions: "Admin" },
    { value: "Researcher", label: "Researcher", permissions: "Admin" },
    { value: "Scientist", label: "Scientist", permissions: "Admin" },
    { value: "IT Specialist", label: "IT Specialist", permissions: "Admin" },
    { value: "Safety Officer", label: "Safety Officer", permissions: "Admin" },
    { value: "Chemist", label: "Chemist", permissions: "Write" },
    {
      value: "Field Researcher",
      label: "Field Researcher",
      permissions: "Write",
    },
    {
      value: "Quality Control Officer",
      label: "Quality Control Officer",
      permissions: "Admin",
    },
  ];

  const subNavigation = [
    { id: 1, name: "About", href: "#", icon: Building, current: true },
    {
      id: 2,
      name: "Add new members",
      href: "#",
      icon: UserPlus,
      current: false,
    },
    { id: 3, name: "Members", href: "#", icon: Users, current: false },
    {
      id: 4,
      name: "Organizational Roles",
      href: "#",
      icon: ShieldCheck,
      current: false,
    },
    {
      id: 5,
      name: "Entities",
      href: "#",
      icon: Database,
      current: false,
    },
    {
      id: 6,
      name: "Logs",
      href: "#",
      icon: FileText,
      current: false,
    },
    {
      id: 7,
      name: "Leave Organization",
      href: "#",
      icon: LogOut,
      current: false,
    },
  ];

  const {
    loading: loadingUserDetails,
    error: errorLoadingDetails,
    sucess: sucessLoadingDetails,
    user,
  } = userDetails;

  const orgListMy = useSelector((state) => state.orgListMy);
  const { loading: loading, error: error, sucess: sucess, orgs } = orgListMy;

  const orgListMyCollab = useSelector((state) => state.orgListMyCollab);
  const { sucess: sucessCollab, orgs: orgsCollab } = orgListMyCollab;

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
    if (newCollab) {
      dispatch(listMyOrgs());
      dispatch(listMyCollabOrgs());
      getProjectStats();
      setNewCollab(false);
    }
  }, [newCollab]);
  //newOrg
  useEffect(() => {
    if (newOrg) {
      dispatch(listMyOrgs());
      dispatch(listMyCollabOrgs());
    }
  }, [newOrg]);
  //updateCollabRole
  useEffect(() => {
    if (updateCollabRole) {
      dispatch(listMyOrgs());
      dispatch(listMyCollabOrgs());
      setUpdateCollabRole(false);
    }
  }, [updateCollabRole]);

  const findOrg =
    orgs && orgs.length > 0
      ? orgs[0]
      : orgsCollab && orgsCollab.length > 0
      ? orgsCollab[0]
      : null;

  const [userStatus, setUserStatus] = useState(
    findOrg &&
      findOrg.collaborators.find((u) => u.user === userInfo._id) &&
      findOrg.collaborators.find((u) => u.user === userInfo._id).userStatus
  );

  console.log(
    findOrg &&
      findOrg.collaborators.find((u) => u.user === userInfo._id) &&
      findOrg.collaborators.find((u) => u.user === userInfo._id).userStatus
  );
  const findOrgRole =
    orgs && orgs.length > 0
      ? orgs[0].user == userInfo._id && "Owner"
      : orgsCollab && orgsCollab.length > 0
      ? orgsCollab[0].collaborators.find((e) => e.user == userInfo._id) &&
        orgsCollab[0].collaborators.find((e) => e.user == userInfo._id)
          .permissions
      : null;

  console.log(findOrgRole);

  const [name, setName] = useState(findOrg && findOrg.name);
  const [description, setDescription] = useState(
    findOrg && findOrg.description
  );

  const getProjectStats = async () => {
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
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!orgContent) {
      if (findOrg) {
        getProjectStats();
      }
    }
  }, [findOrg, orgContent]);

  useEffect(() => {
    if (localStorage.getItem("stellrStatusUpdate")) {
      const { sendData: data, logData, type, user, to } = JSON.parse(
        localStorage.getItem("stellrStatusUpdateData")
      );
      if (user) {
        if (user === userInfo._id) {
          if (type === "Protocol") {
            const finalLogData = JSON.parse(logData);
            var config = {
              method: "put",
              url: `${URL}api/protocols/status/${finalLogData.entryId}`,
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
                "Content-Type": "application/json",
              },
              data: data,
            };

            axios(config)
              .then(async function(response) {
                console.log(response.data);
                await addProtocolLogs(finalLogData);
                await addNotification({
                  id: to,
                  type: "Not read",
                  value: JSON.stringify({
                    subject: finalLogData.message,
                    date: new Date(),
                  }),
                  token: userInfo.token,
                });
                setNewCollab(true);
                setOrgStatus(false);
                localStorage.removeItem("stellrStatusUpdate");
                localStorage.removeItem("stellrStatusUpdateData");
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            const finalLogData = JSON.parse(logData);
            var config = {
              method: "put",
              url: `${URL}api/sops/status/${finalLogData.entryId}`,
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
                "Content-Type": "application/json",
              },
              data: data,
            };

            axios(config)
              .then(async function(response) {
                console.log(response.data);
                await addSOPLogs(finalLogData);
                setNewCollab(true);
                setOrgStatus(false);
                localStorage.removeItem("stellrStatusUpdate");
                localStorage.removeItem("stellrStatusUpdateData");
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        }
      }
    }
  }, []);

  let finalCount =
    orgContent &&
    orgContent.orgData &&
    orgContent.orgData
      .map((u) => {
        return u.protocols.length;
      })
      .reduce((partialSum, a) => partialSum + a, 0);

  let finalCountSOP =
    orgContent &&
    orgContent.orgData &&
    orgContent.orgData
      .map((u) => {
        return u.sops.length;
      })
      .reduce((partialSum, a) => partialSum + a, 0);

  const ownerUser = async () => {
    var config = {
      method: "get",
      url: `${URL}api/users/${findOrg.user}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(async function(response) {
        if (response) {
          setOwnerUserData(response.data);
        } else {
          toast.error("No user found for that email.");
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (findOrg) {
      if (!ownerUserData) {
        ownerUser();
      }
    }
  }, [ownerUserData, findOrg]);

  const addCollaborator = async () => {
    console.log(email);
    var data = JSON.stringify({
      email: `${email}`,
    });

    var config = {
      method: "post",
      url: `${URL}api/users/email`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function(response) {
        if (response.data.length > 0) {
          console.log(response.data);

          const data = {
            orgId: findOrg._id,
            collabDetails: {
              user: response.data[0]._id,
              userName: response.data[0].name ? response.data[0].name : "",
              userEmail: response.data[0].email ? response.data[0].email : "",
              userStatus: "Invited",
            },
          };
          var config = {
            method: "post",
            url: `${URL}api/organs/collab`,
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios(config)
            .then(async (responseData) => {
              const logObject = {
                entryId: findOrg._id,
                user: userInfo._id,
                userName: userInfo.name,
                userEmail: userInfo.email,
                message: `Invited the user with name ${
                  response.data[0].name ? response.data[0].name : ""
                }`,
              };
              await addOrgLogs(logObject);
              await addNotification({
                id: response.data[0]._id,
                type: "Not read",
                value: JSON.stringify({
                  subject: `You have been invited to join ${findOrg.name} by ${userInfo.name}`,
                  date: new Date(),
                }),
                token: userInfo.token,
              });
              setNewCollab(true);
              setOrgSettings(false);
            })
            .catch(function(error) {
              console.log(error);
              toast.error("There was an error adding member.");
            });
        } else {
          toast.error("No user found for that email.");
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const updateUserStatusOrg = async (e, status, id) => {
    e.preventDefault();

    // await addNotification({
    //   id: id,
    //   type: "Not read",
    //   value: JSON.stringify({
    //     subject:
    //       "Your role has been updated to " +
    //       selectedRole.label +
    //       " by " +
    //       userInfo.name,
    //     date: new Date(),
    //   }),
    //   token: userInfo.token,
    // });
    const data = {
      projectId: findOrg._id,
      status: status,
      id: id,
    };
    var config = {
      method: "post",
      url: `${URL}api/organs/collab/update/status`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function(response) {
        const logObject = {
          entryId: findOrg._id,
          user: userInfo._id,
          userName: userInfo.name,
          userEmail: userInfo.email,
          message: `Accepted the invitation and joined the organization.`,
        };
        await addOrgLogs(logObject);
        setNewCollab(true);
        setUserStatus("Joined");
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const [alreadyMadeRoles, setAlreadyMadeRoles] = useState();

  const updateOrgProfile = async () => {
    const data = {
      name: name,
      description: description,
    };
    var config = {
      method: "put",
      url: `${URL}api/organs/${findOrg._id}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function(response) {
        const logObject = {
          entryId: findOrg._id,
          user: userInfo._id,
          userName: userInfo.name,
          userEmail: userInfo.email,
          message: `Updated the organization.`,
        };
        await addOrgLogs(logObject);
        setNewCollab(true);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const fetchallRoles = async () => {
    var config = {
      method: "get",
      url: `${URL}api/orgRole/${findOrg._id}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };
    axios(config)
      .then(function(response) {
        setAlreadyMadeRoles(
          response.data.map(
            ({ name: label, name: value, permissions: permissions }) => ({
              label,
              value,
              permissions,
            })
          )
        );
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  useEffect(() => {
    if (!alreadyMadeRoles) {
      if (findOrg) {
        fetchallRoles();
      }
    }
  }, [alreadyMadeRoles, findOrg]);

  return (
    <div className="project-component">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Organization Management | Electronic Lab Notebook</title>
        <meta
          name="description"
          content="Efficiently manage and track bio-pharma research projects with ourElectronic Lab Notebook software. Simplify collaboration and enhance data organization."
        />
      </Helmet>
      <>
        {orgSettings && (
          <OrgnizationSettings
            orgContent={orgContentSettings}
            setOrgSettings={setOrgSettings}
            setNewCollab={setNewCollab}
            setUpdatedUserCollabRoleOrg={setUpdatedUserCollabRoleOrg}
            setUpdateCollabRole={setUpdateCollabRole}
          />
        )}
        {changeStatus && (
          <OrganizationStatusModal
            setNewCollab={setNewCollab}
            setOrgStatus={setOrgStatus}
            orgStatusContent={orgStatusContent}
            type={eType}
          />
        )}
        {orgs && (
          <>
            <div className="w-full mx-auto h-full overflow-y-auto font-dmsans">
              <Disclosure
                as="div"
                className="relative bg-indigo-700 pb-32 overflow-hidden"
              >
                {({ open }) => (
                  <>
                    <nav
                      className={classNames(
                        open ? "bg-indigo-900" : "bg-transparent",
                        "relative z-10 border-b border-teal-500 border-opacity-25 lg:bg-transparent lg:border-none"
                      )}
                    ></nav>
                    <div
                      aria-hidden="true"
                      className={classNames(
                        open ? "bottom-0" : "inset-y-0",
                        "absolute inset-x-0 left-1/2 transform -translate-x-1/2 w-full overflow-hidden lg:inset-y-0"
                      )}
                    >
                      <div className="absolute inset-0 flex">
                        <div
                          className="h-full w-1/2"
                          style={{ backgroundColor: "#4f46e5" }}
                        />
                        <div
                          className="h-full w-1/2"
                          style={{ backgroundColor: "#4f46e5" }}
                        />
                      </div>
                      <div className="relative flex justify-center">
                        <svg
                          className="flex-shrink-0"
                          width={1750}
                          height={308}
                          viewBox="0 0 1750 308"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M284.161 308H1465.84L875.001 182.413 284.161 308z"
                            fill="#5d00d2"
                          />
                          <path
                            d="M1465.84 308L16.816 0H1750v308h-284.16z"
                            fill="#5d00d2"
                          />
                          <path
                            d="M1733.19 0L284.161 308H0V0h1733.19z"
                            fill="#5d00d2"
                          />
                          <path
                            d="M875.001 182.413L1733.19 0H16.816l858.185 182.413z"
                            fill="#5d00d2"
                          />
                        </svg>
                      </div>
                    </div>
                    <header className="relative py-10">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-white font-body">
                          Organizational Settings
                        </h1>
                      </div>
                    </header>
                  </>
                )}
              </Disclosure>
              {findOrg && userStatus != "Invited" ? (
                <main className="relative -mt-32">
                  <LogsModal
                    setOpen={setLogs}
                    open={logs}
                    logs={findOrg && findOrg.logs ? findOrg.logs : []}
                  />
                  {loader && <SpinnerLoader />}
                  {settingsModal && (
                    <OrgSettingsModal
                      setSettingsModal={setSettingsModal}
                      project={findOrg}
                      id={updateUserId}
                      setUpdatedUserCollabRoleOrg={setUpdatedUserCollabRoleOrg}
                      setUpdateCollabRole={setUpdateCollabRole}
                    />
                  )}
                  <LeaveOrganization
                    open={leaveOrg}
                    setOpen={setLeaveOrg}
                    findOrg={findOrg && findOrg}
                    setUserStatus={setUserStatus}
                    setNewCollab={setNewCollab}
                    setWhichTabisActive={setWhichTabisActive}
                  />
                  {findOrg && (
                    <div className="max-w-screen-xl mx-auto pb-6 px-4 sm:px-6 lg:pb-16 lg:px-8">
                      <div className="bg-white rounded-lg shadow overflow-hidden max-w-5xl mx-auto">
                        <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                          <aside className="py-6 lg:col-span-3">
                            <nav className="space-y-1">
                              {subNavigation.map((item) => (
                                <a
                                  key={item.name}
                                  href={item.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setActiveSub(item.id);
                                  }}
                                  className={classNames(
                                    item.id == activeSub
                                      ? "bg-indigo-50 border-indigo-500 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700"
                                      : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                                    "group border-l-4 px-3 py-2 flex items-center text-sm font-medium"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.id == activeSub
                                        ? "text-indigo-500 group-hover:text-indigo-500"
                                        : "text-gray-400 group-hover:text-gray-500",
                                      "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="truncate">{item.name}</span>
                                </a>
                              ))}
                            </nav>
                          </aside>
                          {activeSub == 1 && (
                            <form className="divide-y divide-gray-200 lg:col-span-9">
                              <div className="py-6 px-4 sm:p-6 lg:pb-8">
                                <div>
                                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                                    About {findOrg.name}
                                  </h2>
                                  <p className="mt-1 text-sm text-gray-500">
                                    This organization was created on{" "}
                                    {addTime(findOrg.createdAt)}.
                                  </p>
                                </div>

                                <div className="mt-6 flex flex-col lg:flex-row">
                                  <div className="flex-grow space-y-6">
                                    <div>
                                      <label
                                        htmlFor="username"
                                        className="block text-sm font-medium text-gray-700"
                                      >
                                        Organization ID
                                      </label>
                                      <div className="mt-1 rounded-md shadow-sm flex">
                                        <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                                          ORG-
                                        </span>
                                        <input
                                          type="text"
                                          name="username"
                                          id="username"
                                          autoComplete="username"
                                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                          value={findOrg && findOrg._id}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                      <label
                                        htmlFor="first-name"
                                        className="block text-sm font-medium text-gray-700"
                                      >
                                        Name
                                      </label>
                                      <input
                                        value={name}
                                        onChange={(e) =>
                                          setName(e.target.value)
                                        }
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label
                                        htmlFor="about"
                                        className="block text-sm font-medium text-gray-700"
                                      >
                                        About
                                      </label>
                                      <div className="mt-1">
                                        <textarea
                                          id="about"
                                          name="about"
                                          rows={5}
                                          onChange={(e) =>
                                            setDescription(e.target.value)
                                          }
                                          value={description}
                                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                          defaultValue={""}
                                        />
                                      </div>
                                      <p className="mt-2 text-sm text-gray-500">
                                        Brief description about the
                                        organization.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-6">
                                  <label
                                    htmlFor="about"
                                    className="block text-sm font-medium text-gray-700 mb-4"
                                  >
                                    Invitation Code
                                  </label>

                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setLoader(true);
                                      if (findOrgRole != "Read") {
                                        window.setTimeout(() => {
                                          setLoader(false);
                                          navigator.clipboard.writeText(
                                            `ORG-${findOrg._id}`
                                          );
                                          toast.success(
                                            "Code copied to clipboard"
                                          );
                                        }, 3000);
                                      } else {
                                        window.setTimeout(() => {
                                          setLoader(false);

                                          toast.error(
                                            "You dont have permissions to add new members."
                                          );
                                        }, 3000);
                                      }
                                    }}
                                    className="text-indigo-600 rounded-xl flex items-center justify-left shadow-md px-5 py-2 w-fit"
                                  >
                                    <Copy className="w-4 mr-2" />
                                    Generate invite code
                                  </a>
                                </div>
                              </div>

                              <div className="pt-6 divide-y divide-gray-200">
                                <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                                  <button
                                    type="button"
                                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      updateOrgProfile();
                                    }}
                                    className="ml-5 bg-indigo-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                          {activeSub == 2 && (
                            <form className="divide-y divide-gray-200 lg:col-span-9">
                              {findOrgRole && findOrgRole != "Read" ? (
                                <div className="py-6 px-4 sm:p-6 lg:pb-8">
                                  <div>
                                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                                      Add new members
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                      This information will be displayed
                                      publicly so be careful what you share.
                                    </p>
                                  </div>
                                  <div className="space-y-1 max-w-md mt-6">
                                    <label
                                      htmlFor="add-team-members"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Add Team Members
                                    </label>
                                    <p
                                      id="add-team-members-helper"
                                      className="sr-only"
                                    >
                                      Search by email address
                                    </p>
                                    <div className="flex">
                                      <div className="flex-grow">
                                        <input
                                          type="text"
                                          name="add-team-members"
                                          id="add-team-members"
                                          className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                          placeholder="Email address"
                                          onChange={(e) =>
                                            setEmail(e.target.value)
                                          }
                                          aria-describedby="add-team-members-helper"
                                        />
                                      </div>
                                      <span className="ml-3">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            addCollaborator();
                                          }}
                                          className="bg-white inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                        >
                                          <PlusIcon
                                            className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                          />
                                          <span>Add</span>
                                        </button>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-10 max-w-md">
                                    <div className="flow-root mt-6">
                                      <ul
                                        role="list"
                                        className="-my-5 divide-y divide-gray-200"
                                      >
                                        {findOrg &&
                                        findOrg.collaborators &&
                                        findOrg.collaborators.length > 0 ? (
                                          findOrg.collaborators
                                            .filter(
                                              (f) => f.userStatus == "Invited"
                                            )
                                            .map((person) => (
                                              <li
                                                key={person.user}
                                                className="py-4"
                                              >
                                                <div className="flex items-center space-x-4">
                                                  <div className="flex-shrink-0">
                                                    <img
                                                      className="h-8 w-8 rounded-full"
                                                      src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${person.userName}`}
                                                      alt=""
                                                    />
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                      {person.userName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                      {person.userEmail}
                                                    </p>
                                                  </div>
                                                  <div>
                                                    <a
                                                      href="#"
                                                      className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                      Invited
                                                    </a>
                                                  </div>
                                                </div>
                                              </li>
                                            ))
                                        ) : (
                                          <>0 members</>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-6 px-4 sm:p-6 lg:pb-8">
                                  <div>
                                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                                      Add new members
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                      This information will be displayed
                                      publicly so be careful what you share.
                                    </p>
                                  </div>
                                  <div className="space-y-1 max-w-md mt-6">
                                    <div className="">
                                      <Ban className="text-red-500 my-2" />{" "}
                                      <p
                                        id="add-team-members-helper"
                                        className="font-dmsans"
                                      >
                                        You dont have permissions to add new
                                        members.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-10 max-w-md">
                                    <div className="flow-root mt-6">
                                      <ul
                                        role="list"
                                        className="-my-5 divide-y divide-gray-200"
                                      >
                                        {findOrg &&
                                        findOrg.collaborators &&
                                        findOrg.collaborators.length > 0 ? (
                                          findOrg.collaborators
                                            .filter(
                                              (f) => f.userStatus == "Invited"
                                            )
                                            .map((person) => (
                                              <li
                                                key={person.user}
                                                className="py-4"
                                              >
                                                <div className="flex items-center space-x-4">
                                                  <div className="flex-shrink-0">
                                                    <img
                                                      className="h-8 w-8 rounded-full"
                                                      src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${person.userName}`}
                                                      alt=""
                                                    />
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                      {person.userName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                      {person.userEmail}
                                                    </p>
                                                  </div>
                                                  <div>
                                                    <a
                                                      href="#"
                                                      className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                      Invited
                                                    </a>
                                                  </div>
                                                </div>
                                              </li>
                                            ))
                                        ) : (
                                          <>0 members</>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="pt-6 divide-y divide-gray-200">
                                <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                                  <button
                                    type="button"
                                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="ml-5 bg-indigo-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}

                          {activeSub == 3 && (
                            <form className="divide-y divide-gray-200 lg:col-span-9">
                              <div className="py-6 px-4 sm:p-6 lg:pb-8">
                                <div>
                                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                                    Members
                                  </h2>
                                  <p className="mt-1 text-sm text-gray-500">
                                    This information will be displayed publicly
                                    so be careful what you share.
                                  </p>
                                </div>

                                <div className="mt-10 max-w-md">
                                  <div className="flow-root mt-6">
                                    <ul
                                      role="list"
                                      className="-my-5 divide-y divide-gray-200"
                                    >
                                      {ownerUserData && (
                                        <li
                                          key={ownerUserData._id}
                                          className="py-4"
                                        >
                                          <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                              <img
                                                className="h-8 w-8 rounded-full"
                                                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${ownerUserData.name}`}
                                                alt=""
                                              />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-gray-900 truncate">
                                                {ownerUserData.name}{" "}
                                                {ownerUserData._id ===
                                                  userInfo._id && "(You)"}
                                              </p>
                                              <p className="text-sm text-gray-500 truncate">
                                                {ownerUserData.email}
                                              </p>
                                            </div>
                                            <div>
                                              <a
                                                href="#"
                                                className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                                              >
                                                Owner
                                              </a>
                                            </div>
                                          </div>
                                        </li>
                                      )}
                                      {findOrg &&
                                      findOrg.collaborators &&
                                      findOrg.collaborators.length > 0 ? (
                                        findOrg.collaborators
                                          .filter(
                                            (u) => u.userStatus != "Invited"
                                          )
                                          .map((person) => (
                                            <li
                                              key={person.user}
                                              className="py-4"
                                            >
                                              <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                  <img
                                                    className="h-8 w-8 rounded-full"
                                                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${person.userName}`}
                                                    alt=""
                                                  />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-medium text-gray-900 truncate">
                                                    {person.userName}
                                                  </p>
                                                  <p className="text-sm text-gray-500 truncate">
                                                    {person.userEmail}
                                                  </p>
                                                </div>
                                                <div>
                                                  <a
                                                    href="#"
                                                    className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                                                  >
                                                    {person.userType}
                                                  </a>
                                                </div>
                                                {findOrgRole &&
                                                  findOrgRole !== "Read" && (
                                                    <div>
                                                      <a
                                                        href="#"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          setUpdateUserId(
                                                            person.user
                                                          );
                                                          setSettingsModal(
                                                            true
                                                          );
                                                        }}
                                                        className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-indigo-300 text-sm leading-5 font-medium rounded-full text-indigo-700 bg-white hover:bg-gray-50"
                                                      >
                                                        change role
                                                      </a>
                                                    </div>
                                                  )}
                                              </div>
                                            </li>
                                          ))
                                      ) : (
                                        <>0 members</>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-6 divide-y divide-gray-200">
                                <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                                  <button
                                    type="button"
                                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="ml-5 bg-indigo-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                          {activeSub == 4 && (
                            <form className="divide-y divide-gray-200 lg:col-span-9">
                              <div className="py-6 px-4 sm:p-6 lg:pb-8">
                                <div>
                                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                                    Organizational Roles
                                  </h2>
                                  <p className="mt-1 text-sm text-gray-500">
                                    This organization was created on{" "}
                                    {addTime(findOrg.createdAt)}.
                                  </p>
                                </div>

                                <div className="mt-6 flex flex-col lg:flex-row w-[90%] mx-auto">
                                  <div className="flex-grow space-y-6">
                                    <div>
                                      <div className="flow-root mt-6 pb-10">
                                        <ul
                                          role="list"
                                          className="-my-5 divide-y divide-gray-200"
                                        >
                                          {roleOptions.map((announcement) => (
                                            <li
                                              key={announcement.label}
                                              className="py-5"
                                            >
                                              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                                                <h3 className="text-sm font-semibold text-gray-800">
                                                  <a
                                                    href="#"
                                                    className="hover:underline focus:outline-none"
                                                  >
                                                    {/* Extend touch target to entire panel */}
                                                    <span
                                                      className="absolute inset-0"
                                                      aria-hidden="true"
                                                    />
                                                    {announcement.label}
                                                  </a>
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                                  {announcement.permissions}
                                                </p>
                                              </div>
                                            </li>
                                          ))}
                                          {alreadyMadeRoles &&
                                            alreadyMadeRoles.length > 0 &&
                                            alreadyMadeRoles.map(
                                              (announcement) => (
                                                <li
                                                  key={announcement.label}
                                                  className="py-5"
                                                >
                                                  <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                                                    <h3 className="text-sm font-semibold text-gray-800">
                                                      <a
                                                        href="#"
                                                        className="hover:underline focus:outline-none"
                                                      >
                                                        {/* Extend touch target to entire panel */}
                                                        <span
                                                          className="absolute inset-0"
                                                          aria-hidden="true"
                                                        />
                                                        {announcement.label}
                                                      </a>
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                                      {announcement.permissions}
                                                    </p>
                                                  </div>
                                                </li>
                                              )
                                            )}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-6 divide-y divide-gray-200">
                                <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                                  <button
                                    type="button"
                                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="ml-5 bg-indigo-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                          {activeSub == 5 && (
                            <form className="divide-y divide-gray-200 lg:col-span-9">
                              <div className="py-6 px-4 sm:p-6 lg:pb-8">
                                <div>
                                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                                    All Entities
                                  </h2>
                                  <p className="mt-1 text-sm text-gray-500">
                                    This information will be displayed publicly
                                    so be careful what you share.
                                  </p>
                                </div>
                                <div className="mt-6">
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setWhichTabisActive("orgListEntities");
                                    }}
                                    className="text-indigo-600 rounded-md flex items-center justify-left shadow-md px-5 py-2 w-fit"
                                  >
                                    <ExternalLink className="w-4 mr-2" />
                                    Click here
                                  </a>
                                  {/* <div className="flex flex-col">
                                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="py-2 align-middle inline-block min-w-fit sm:px-6 lg:px-8">
                                      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                        <table className="min-w-fit divide-y divide-gray-200">
                                          <thead className="bg-gray-50">
                                            <tr>
                                              <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                              >
                                                Name
                                              </th>

                                              <th
                                                scope="col"
                                                className="relative px-6 py-3"
                                              >
                                                <span className="sr-only">
                                                  Edit
                                                </span>
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {[{ name: "protocols" }].map(
                                              (person, personIdx) => (
                                                <tr
                                                  key={person.email}
                                                  className={
                                                    personIdx % 2 === 0
                                                      ? "bg-white"
                                                      : "bg-gray-50"
                                                  }
                                                >
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {person.name}
                                                  </td>

                                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a
                                                      href="#"
                                                      onClick={(e) => {
                                                        setWhichTabisActive(
                                                          "orgListEntities"
                                                        );
                                                      }}
                                                      className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                      View
                                                    </a>
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div> */}
                                </div>
                              </div>

                              <div className="pt-6 divide-y divide-gray-200">
                                <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                                  <button
                                    type="button"
                                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="ml-5 bg-indigo-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                          {activeSub == 6 && (
                            <form className="divide-y divide-gray-200 lg:col-span-9">
                              <div className="py-6 px-4 sm:p-6 lg:pb-8">
                                <div>
                                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                                    Logs
                                  </h2>
                                  <p className="mt-1 text-sm text-gray-500">
                                    This information will be displayed publicly
                                    so be careful what you share.
                                  </p>
                                </div>
                                <div className="mt-6">
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setLogs(true);
                                    }}
                                    className="text-indigo-600 rounded-xl flex items-center justify-left shadow-md px-5 py-2 w-fit"
                                  >
                                    <ExternalLink className="w-4 mr-2" />
                                    Click here to view logs
                                  </a>
                                </div>
                              </div>

                              <div className="pt-6 divide-y divide-gray-200">
                                <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                                  <button
                                    type="button"
                                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="ml-5 bg-indigo-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                          {activeSub == 7 && (
                            <form className="divide-y divide-gray-200 lg:col-span-9">
                              <div className="py-6 px-4 sm:p-6 lg:pb-8">
                                <div>
                                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                                    Leave Organization
                                  </h2>
                                  <p className="mt-1 text-sm text-gray-500">
                                    This information will be displayed publicly
                                    so be careful what you share.
                                  </p>
                                </div>
                                <div className="mt-6">
                                  {findOrgRole && findOrgRole === "Owner" ? (
                                    <div className="py-5">
                                      <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                                        <h3 className="text-sm font-semibold text-gray-800">
                                          <a
                                            href="#"
                                            className="hover:underline focus:outline-none"
                                          >
                                            {/* Extend touch target to entire panel */}
                                            <span
                                              className="absolute inset-0"
                                              aria-hidden="true"
                                            />
                                            {userInfo.name &&
                                              findOrgRole &&
                                              `${ownerUserData.name} (Owner)`}
                                          </a>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                          {" "}
                                          As a owner you cannot leave the
                                          organization.
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="py-5">
                                      <div className="relative">
                                        <h3 className="text-sm font-semibold text-gray-800">
                                          <a
                                            href="#"
                                            className="hover:underline focus:outline-none"
                                          >
                                            {/* Extend touch target to entire panel */}

                                            {userInfo &&
                                              findOrgRole &&
                                              `${userInfo.name} (${findOrgRole})`}
                                          </a>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                          {" "}
                                          Leaving the organization will make you
                                          lose all the perks and establishments
                                          from the organization.
                                        </p>
                                        <button
                                          type="submit"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setLeaveOrg(true);
                                          }}
                                          className="mt-4 bg-pink-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                        >
                                          Leave the organization
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="pt-6 divide-y divide-gray-200">
                                <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                                  <button
                                    type="button"
                                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="ml-5 bg-indigo-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </main>
              ) : (
                <main className="relative -mt-32">
                  <div className="max-w-screen-xl mx-auto pb-6 px-4 sm:px-6 lg:pb-16 lg:px-8">
                    <div className="bg-white rounded-lg shadow overflow-hidden max-w-5xl mx-auto">
                      <div className="min-h-[50vh] flex items-start justify-center w-full mt-10">
                        {findOrg ? (
                          <div className="space-y-5 w-[60%] mt-6">
                            <label
                              htmlFor="add-team-members"
                              className="block font-medium text-gray-700 text-xl font-bod"
                            >
                              Your Invitations
                            </label>
                            <>
                              {" "}
                              <p
                                id="add-team-members-helper"
                                className="sr-only"
                              >
                                Search by email address
                              </p>{" "}
                              <div className="flex">
                                <div className="flex-grow">
                                  <input
                                    type="text"
                                    name="add-team-members"
                                    id="add-team-members"
                                    disabled
                                    value={findOrg && findOrg.name}
                                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Paste the invite link"
                                    aria-describedby="add-team-members-helper"
                                  />
                                </div>
                                <span className="ml-3">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      updateUserStatusOrg(
                                        e,
                                        "Joined",
                                        userInfo._id
                                      );
                                    }}
                                    className="bg-white inline-flex items-center px-4 py-2 border border-indigo-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    <CheckCircle2
                                      className="-ml-2 mr-1 h-5 w-5 text-indigo-400"
                                      aria-hidden="true"
                                    />
                                    <span>Accept</span>
                                  </button>
                                </span>
                                <span className="ml-3">
                                  <button
                                    type="button"
                                    className="bg-white inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  >
                                    <X
                                      className="-ml-2 mr-1 h-5 w-5 text-red-400"
                                      aria-hidden="true"
                                    />
                                    <span>Decline</span>
                                  </button>
                                </span>
                              </div>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCreateOrg(true);
                                }}
                                className="text-indigo-600 rounded-xl flex items-center justify-left shadow-md px-5 py-2 w-fit"
                              >
                                <ExternalLink className="w-4 mr-2" />
                                Join or create a new organization
                              </a>
                            </>
                          </div>
                        ) : (
                          <div className="space-y-5 w-[60%] mt-6">
                            <label
                              htmlFor="add-team-members"
                              className="block font-medium text-gray-700 text-xl font-bod"
                            >
                              Join or Create an Organization
                            </label>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCreateOrg(true);
                              }}
                              className="text-indigo-600 rounded-xl flex items-center justify-left shadow-md px-5 py-2 w-fit"
                            >
                              <ExternalLink className="w-4 mr-2" />
                              Click here
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </main>
              )}
            </div>
          </>
          // <div className="project-component-inside overflow-y-auto">
          //   <div className="w-[80%] mx-auto pt-10 font-sans">
          //     <main className="max-w-lg mx-auto pt-10 pb-12 px-4 lg:pb-16">
          //       <form>
          //         <div className="space-y-6">
          //           <div>
          //             <h1 className="text-lg leading-6 font-medium text-gray-900">
          //               Organization Settings
          //             </h1>
          //             {/* <p className="mt-1 text-sm text-gray-500">
          //               Let’s get started by filling in the information below to
          //               create your new project.
          //             </p> */}
          //           </div>
          //           <hr />
          //           <div>
          //             <label
          //               htmlFor="project-name"
          //               className="block text-sm font-medium text-gray-700"
          //             >
          //               Project Name
          //             </label>
          //             <div className="mt-1">
          //               <input
          //                 type="text"
          //                 name="project-name"
          //                 id="project-name"
          //                 className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
          //                 defaultValue={findOrg && findOrg.name}
          //                 disabled
          //               />
          //             </div>
          //           </div>
          //           {findOrg && (
          //             <div className="space-y-2">
          //               <div className="space-y-1">
          //                 <label
          //                   htmlFor="add-team-members"
          //                   className="block text-sm font-medium text-gray-700"
          //                 >
          //                   Copy Invite Code
          //                 </label>
          //                 {/* <p id="add-team-members-helper" className="sr-only">
          //                 Search by email address
          //               </p> */}
          //                 <div className="flex">
          //                   <div className="flex-grow">
          //                     <input
          //                       type="text"
          //                       name="add-team-members"
          //                       id="add-team-members"
          //                       className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
          //                       placeholder="Email address"
          //                       aria-describedby="add-team-members-helper"
          //                       defaultValue={`ORG-${findOrg._id}`}
          //                       disabled
          //                     />
          //                   </div>
          //                   <span className="ml-3">
          //                     <button
          //                       type="button"
          //                       onClick={() => {
          //                         navigator.clipboard.writeText(
          //                           `ORG-${findOrg._id}`
          //                         );
          //                         toast.success("Code Copied to clipboard");
          //                       }}
          //                       className="bg-white inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          //                     >
          //                       <PlusIcon
          //                         className="-ml-2 mr-1 h-5 w-5 text-gray-400"
          //                         aria-hidden="true"
          //                       />
          //                       <span>Copy</span>
          //                     </button>
          //                   </span>
          //                 </div>
          //               </div>
          //             </div>
          //           )}

          //           <div className="space-y-2">
          //             <div className="space-y-1">
          //               <label
          //                 htmlFor="add-team-members"
          //                 className="block text-sm font-medium text-gray-700"
          //               >
          //                 Team Members
          //               </label>
          //               <p id="add-team-members-helper" className="sr-only">
          //                 Search by email address
          //               </p>
          //               {/* <div className="flex">
          //                 <div className="flex-grow">
          //                   <input
          //                     type="text"
          //                     name="add-team-members"
          //                     id="add-team-members"
          //                     className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
          //                     placeholder="Email address"
          //                     aria-describedby="add-team-members-helper"
          //                   />
          //                 </div>
          //                 <span className="ml-3">
          //                   <button
          //                     type="button"
          //                     className="bg-white inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          //                   >
          //                     <PlusIcon
          //                       className="-ml-2 mr-1 h-5 w-5 text-gray-400"
          //                       aria-hidden="true"
          //                     />
          //                     <span>Add</span>
          //                   </button>
          //                 </span>
          //               </div> */}
          //             </div>

          //             <div className="border-b border-gray-200">
          //               <ul role="list" className="divide-y divide-gray-200">
          //                 {ownerUserData && (
          //                   <li key={ownerUserData.name} className="py-4 flex">
          //                     <img
          //                       className="h-10 w-10 rounded-full"
          //                       src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${ownerUserData.name}`}
          //                       alt=""
          //                     />
          //                     <div className="ml-3 flex flex-col">
          //                       <span className="text-sm font-medium text-gray-900 flex">
          //                         {ownerUserData.name
          //                           ? ownerUserData.name
          //                           : ownerUserData._id}
          //                         <Crown
          //                           size={12}
          //                           className="text-indigo-600 ml-2"
          //                         />
          //                       </span>
          //                       <span className="text-sm text-gray-500">
          //                         {ownerUserData.email}
          //                       </span>
          //                     </div>
          //                   </li>
          //                 )}
          //                 {findOrg &&
          //                   findOrg.collaborators &&
          //                   findOrg.collaborators.length > 0 &&
          //                   findOrg.collaborators.map((person) => (
          //                     <li key={person.userEmail} className="py-4 flex">
          //                       <img
          //                         className="h-10 w-10 rounded-full"
          //                         src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${person.userName}`}
          //                         alt=""
          //                       />
          //                       <div className="ml-3 flex flex-col">
          //                         <span className="text-sm font-medium text-gray-900">
          //                           {person.userName
          //                             ? person.userName
          //                             : person.user}
          //                         </span>
          //                         <span className="text-sm text-gray-500">
          //                           {person.userEmail}
          //                         </span>
          //                       </div>
          //                     </li>
          //                   ))}
          //               </ul>
          //             </div>
          //           </div>

          //           <div>
          //             <label
          //               htmlFor="tags"
          //               className="block text-sm font-medium text-gray-700"
          //             >
          //               Tags
          //             </label>
          //             <input
          //               type="text"
          //               name="tags"
          //               id="tags"
          //               className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
          //             />
          //           </div>

          //           <div className="flex justify-end">
          //             <button
          //               type="submit"
          //               onClick={(e) => {
          //                 if (findOrg) {
          //                   e.preventDefault();
          //                   setOrgContentSettings(findOrg);
          //                   setOrgSettings(true);
          //                 }
          //               }}
          //               className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          //             >
          //               View Settings
          //             </button>
          //           </div>
          //         </div>
          //       </form>
          //     </main>
          //   </div>
          // </div>
        )}
      </>
    </div>
  );
}

export default ListOrganizations;

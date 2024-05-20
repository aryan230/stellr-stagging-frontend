import React, { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  listMyCollabOrgs,
  listMyOrgs,
} from "../redux/actions/organizationActions";
import { getUserDetails } from "../redux/actions/userActions";
import axios from "axios";
import { addProtocolLogs } from "./Functions/addProtocolLogs";
import { addNotification } from "./Functions/addNotification";
import { addSOPLogs } from "./Functions/addSOPLogs";
import URL from "./../Data/data.json";
import { addTime } from "./Functions/addTime";
import OrganizationStatusModal from "./OrganizationSettings/OrganizationStatusModal";
import { Book, File, FileText } from "lucide-react";
function ListOrgEntities({ setWhichTabisActive }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orgSettings, setOrgSettings] = useState(false);
  const [orgStatusContent, setOrgStatusContent] = useState();
  const [orgContent, setOrgContent] = useState();
  const [newCollab, setNewCollab] = useState(false);
  const [changeStatus, setOrgStatus] = useState(false);
  const [eType, setEType] = useState();
  const [nav, setNav] = useState("home");

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
    }
  }, []);

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

  return (
    <div className="w-[95%] mx-auto h-[95%] mt-2 bg-white rounded-md shadow-lg">
      {changeStatus && (
        <OrganizationStatusModal
          setNewCollab={setNewCollab}
          setOrgStatus={setOrgStatus}
          orgStatusContent={orgStatusContent}
          type={eType}
        />
      )}

      <div className="w-[80%] mx-auto font-dmsans py-10">
        <div>
          <nav className="sm:hidden" aria-label="Back">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ChevronLeftIcon
                className="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              Back
            </a>
          </nav>
          <nav className="hidden sm:flex" aria-label="Breadcrumb">
            {nav === "home" && (
              <ol role="list" className="flex items-center space-x-4">
                <li>
                  <div className="flex">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setNav("home");
                        setWhichTabisActive("orgList");
                      }}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Organization Settings
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setNav("home");
                      }}
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Home
                    </a>
                  </div>
                </li>
              </ol>
            )}
            {nav === "protocols" && (
              <ol role="list" className="flex items-center space-x-4">
                <li>
                  <div className="flex">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setNav("home");
                        setWhichTabisActive("orgList");
                      }}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Organization Settings
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setNav("home");
                      }}
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Home
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setNav("protocols");
                      }}
                      aria-current="page"
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Protocols
                    </a>
                  </div>
                </li>
              </ol>
            )}
            {nav === "sops" && (
              <ol role="list" className="flex items-center space-x-4">
                <li>
                  <div className="flex">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setNav("home");
                        setWhichTabisActive("orgList");
                      }}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Organization Settings
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setNav("home");
                      }}
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Home
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setNav("sops");
                      }}
                      aria-current="page"
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      SOPs
                    </a>
                  </div>
                </li>
              </ol>
            )}
          </nav>
        </div>
        <div className="mt-2 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {nav === "home"
                ? "Home"
                : nav === "protocols"
                ? "Protocols"
                : "SOPs"}{" "}
            </h2>
          </div>
          <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      {nav === "home" && (
        <div className="flex flex-col w-[75%] mx-auto font-dmsans h-[80%] overflow-y-auto overflow-x-hidden">
          <div className="flex">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setNav("protocols");
              }}
              className="block max-w-sm p-6 m-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <div className="w-10 h-10 mb-2 bg-indigo-600 rounded-xl flex items-center justify-center">
                {" "}
                <Book className="w-6 h-6 text-white" />
              </div>

              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Protocols
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                There are {finalCount && finalCount} protocols created by{" "}
                {findOrg && findOrg.collaborators.length + 1} members of the
                organization.
              </p>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setNav("sops");
              }}
              className="block max-w-sm p-6 m-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <div className="w-10 h-10 mb-2 bg-indigo-600 rounded-xl flex items-center justify-center">
                {" "}
                <FileText className="w-6 h-6 text-white" />
              </div>

              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                SOPs
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                There are {finalCountSOP && finalCountSOP} SOPs created by{" "}
                {findOrg && findOrg.collaborators.length + 1} members of the
                organization.
              </p>
            </a>
          </div>
        </div>
      )}
      {nav === "protocols" && (
        <div className="flex flex-col w-[75%] mx-auto font-dmsans h-[80%] overflow-y-auto overflow-x-hidden">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Approved/Declined by
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Updated at
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">View</span>
                      </th>
                      {findOrgRole && findOrgRole != "Read" && (
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orgContent &&
                      orgContent.orgData.map((u) =>
                        u.protocols.map((p) => (
                          <tr key={p._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {p.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {p.status === "Draft" && (
                                <span className="bg-gray-500 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                  Draft
                                </span>
                              )}
                              {p.status === "In Progress" && (
                                <span className="bg-indigo-600 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                  In Progress
                                </span>
                              )}
                              {p.status === "Approved" && (
                                <span className="bg-green-600 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                  Approved
                                </span>
                              )}
                              {p.status === "Rejected" && (
                                <span className="bg-red-600 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                  Rejected
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {p.statusBy ? p.statusBy : "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {addTime(p.updatedAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                              </a>
                            </td>
                            {findOrgRole && findOrgRole != "Read" && (
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    let content = u.protocols.find(
                                      (e) => e._id === p._id
                                    );
                                    setEType("Protocol");
                                    setOrgStatusContent(content);
                                    setOrgStatus(true);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Edit Status
                                </a>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {nav === "sops" && (
        <div className="flex flex-col w-[75%] mx-auto font-dmsans h-[80%] overflow-y-auto overflow-x-hidden">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Approved/Declined by
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Updated at
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">View</span>
                      </th>
                      {findOrgRole && findOrgRole != "Read" && (
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orgContent &&
                      orgContent.orgData.map((u) =>
                        u.sops.map((p) => (
                          <tr key={p._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {p.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {p.status === "Draft" && (
                                <span className="bg-gray-500 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                  Draft
                                </span>
                              )}
                              {p.status === "In Progress" && (
                                <span className="bg-indigo-600 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                  In Progress
                                </span>
                              )}
                              {p.status === "Approved" && (
                                <span className="bg-green-600 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                  Approved
                                </span>
                              )}
                              {p.status === "Rejected" && (
                                <span className="bg-red-600 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                  Rejected
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {p.statusBy ? p.statusBy : "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {addTime(p.updatedAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                              </a>
                            </td>
                            {findOrgRole && findOrgRole != "Read" && (
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    let content = u.sops.find(
                                      (e) => e._id === p._id
                                    );
                                    setEType("SOP");
                                    setOrgStatusContent(content);
                                    setOrgStatus(true);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Edit Status
                                </a>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListOrgEntities;

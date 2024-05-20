import {
  Copy,
  FileCog,
  Pencil,
  PlusIcon,
  Settings,
  Trash,
  Unlink,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { encryptData } from "../Functions/Link/Encrypt";
import { addTime } from "../Functions/addTime";
import { useLocation } from "react-router-dom";
import MainModalEntity from "../../UI/MainModals/MainModalEntity";
import BasicModalTailwind from "../../UI/MainModals/BasicModalTailwind";
import {
  ExclamationIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import { toast } from "sonner";
import URL from "./../../Data/data.json";
import { useSelector } from "react-redux";
import { Check } from "@mui/icons-material";

function ShareLinks({
  findOrg,
  share,
  updateShare,
  setLoader,
  type,
  id,
  setOpen,
}) {
  const [expiry, setExpiry] = useState(24);
  const [newLink, setNewLink] = useState(false);
  const [role, setRole] = useState("view");
  const [copied, setCopied] = useState(false);
  const [expiryDate, setExpiryDate] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    console.log(expiryDate);
  }, [expiryDate]);

  console.log(share && share.links);
  return (
    <section aria-labelledby="billing-history-heading">
      <BasicModalTailwind open={newLink} setOpen={setNewLink}>
        <div className="font-dmsans">
          {" "}
          <h1 className="font-black text-xl mb-5 font-ptsans text-gray-700">
            Share link
          </h1>
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-gray-700"
            >
              Select expiry
            </label>
            <select
              id="location"
              name="location"
              className="block mt-1 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base border-gray-300 rounded-md"
              onChange={(e) => {
                if (e.target.value == 24) {
                  setExpiry(e.target.value);
                  setExpiryDate(
                    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                  );
                } else if (e.target.value == 7) {
                  setExpiry(e.target.value);
                  setExpiryDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
                } else {
                  setExpiry(e.target.value);
                  setExpiryDate();
                }
              }}
              defaultValue={24}
            >
              <option value={24}>24 Hours</option>
              <option value={7}>7 Days</option>
              <option value={0}>Custom</option>
            </select>
          </div>
          <div className="mt-5">
            <label
              htmlFor="email"
              className="block text-base font-medium text-gray-700"
            >
              Anyone with the link can be
            </label>
            <select
              id="location"
              name="location"
              className="block mt-1 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base border-gray-300 rounded-md"
              onChange={(e) => {
                setRole(e.target.value);
              }}
              defaultValue="view"
            >
              <option value="view">Viewer</option>
              <option value="edit">Editor</option>
            </select>
          </div>
          {expiry == 0 && (
            <div className="mt-5">
              <label
                htmlFor="email"
                className="block text-base font-medium text-gray-700"
              >
                Select Date & Time
              </label>
              <div className="mt-1">
                <input
                  type="datetime-local"
                  name="email"
                  id="email"
                  min={new Date()}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-base border-gray-300 rounded-md"
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                  }}
                />
              </div>
            </div>
          )}{" "}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-5">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationIcon
                  className="h-5 w-5 text-yellow-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-base text-yellow-700">
                  The link will get expired on <br />
                  <a
                    href="#"
                    className="font-medium underline text-yellow-700 hover:text-yellow-600"
                  >
                    {addTime(expiryDate)}
                  </a>
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              setLoader(true);
              setNewLink(false);
              const datavalue = await {
                expiry: expiryDate.toString(),
                data: JSON.stringify({
                  type: type,
                  id: id,
                  expiry: expiryDate,
                  org: findOrg._id,
                  role: role,
                }),
              };

              var config = {
                method: "post",
                url: `${URL[0]}api/link`,
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                  "Content-Type": "application/json",
                },
                data: datavalue,
              };
              axios(config)
                .then(async function(response) {
                  setLoader(false);
                  const linkValue = await encryptData({
                    id: response.data._id,
                  });
                  if (share) {
                    let old = share;
                    old.links.push({
                      link: `${window.location.host}/s/${linkValue.replaceAll(
                        "/",
                        "Por21Ld"
                      )}`,
                      id: response.data._id,
                      expiry: expiryDate,
                      created: Date.now(),
                    });
                    var Newdata = JSON.stringify({
                      share: JSON.stringify(old),
                    });

                    updateShare(Newdata);
                  } else {
                    let newData = {
                      value: "650b013f2bc72230ddaff4be",
                      users: [],
                      links: [
                        {
                          link: `${
                            window.location.host
                          }/s/${linkValue.replaceAll("/", "Por21Ld")}`,
                          expiry: expiryDate,
                          created: Date.now(),
                          id: response.data._id,
                        },
                      ],
                    };
                    var Newdata = JSON.stringify({
                      share: JSON.stringify(newData),
                    });
                    await updateShare(Newdata);
                  }
                })
                .catch(function(error) {
                  setLoader(false);
                  toast.error("There was some error.");
                });
            }}
            className="inline-flex mt-5 items-center px-3 py-2 border border-transparent text-base leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate
          </button>
        </div>
      </BasicModalTailwind>
      <div className="bg-white pt-6 sm:rounded-md sm:overflow-hidden">
        <div className="px-4 sm:px-6">
          <h2
            id="billing-history-heading"
            className="text-lg leading-6 font-medium text-gray-900"
          >
            Links
          </h2>
        </div>
        <div className="mx-auto w-[80%] my-4">
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              setNewLink(true);
            }}
            className="bg-white inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon
              className="-ml-2 mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <span>Generate new link</span>
          </button>
        </div>
        {share && share.links && share.links.length > 0 ? (
          <div className="flex flex-col w-[80%] mx-auto mt-4">
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
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {share.links.map((person, index) => (
                        <tr key={person.email}>
                          <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                            {addTime(person.created)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                            {addTime(person.expiry) >= addTime(Date.now()) ? (
                              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                                Active
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                                Expired
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.preventDefault();
                                setLoader(true);
                                let old = share;
                                old.links.splice(
                                  old.users.findIndex(
                                    (a) => a.created === person.created
                                  ),
                                  1
                                );
                                var Newdata = JSON.stringify({
                                  share: JSON.stringify(old),
                                });
                                var config = {
                                  method: "delete",
                                  url: `${URL[0]}api/link/share/${person.id}`,
                                  headers: {
                                    Authorization: `Bearer ${userInfo.token}`,
                                    "Content-Type": "application/json",
                                  },
                                };
                                axios(config)
                                  .then(async function(response) {
                                    updateShare(Newdata);
                                  })
                                  .catch(function(error) {
                                    setLoader(false);
                                    toast.error("There was some error.");
                                  });
                              }}
                              className="bg-white inline-flex mr-2 items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <Trash
                                className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <span>Delete</span>
                            </button>
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.preventDefault();
                                setCopied(true);
                                navigator.clipboard.writeText(person.link);
                                window.setTimeout(() => {
                                  setCopied(false);
                                }, 3000);
                              }}
                              className="bg-white inline-flex mr-2 items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              {copied ? (
                                <Check
                                  className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Copy
                                  className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              )}

                              <span>{copied ? "Copied" : "Copy Link"}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-[80%] mx-auto mt-4">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="text-center">
                <Unlink className="mx-auto h-12 w-12 text-gray-400 mt-10" />
                <h3 className="mt-2 text-base font-medium text-gray-900">
                  No shared links.
                </h3>
                <p className="mt-1 text-base text-gray-500">
                  Get started by adding a new link.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ShareLinks;

import React from "react";
import { Fragment, useState, useRef } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import moment from "moment";
import { addTime } from "../../Functions/addTime";
import { userAvatar } from "../../Functions/userAvatar";
import generatePDF from "react-to-pdf";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function EntryVersionHistory({ open, setOpen, tab, project }) {
  const [data, setData] = useState(tab.logs ? tab.logs : []);
  const pdfRef = useRef();
  const strings = [
    "The status of the entity",
    "The entry was submitted for approval",
    "Changed the status of the Entry",
  ];
  //The status of the entity
  //The entry was submitted for approval
  //Changed the status of the Entry

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-[9999999999]"
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex font-sans">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-4xl font-dmsans">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="py-6 px-4 bg-indigo-700 sm:px-6">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-medium text-white">
                        Version History
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-indigo-700 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button className="inline-flex justify-center w-full rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                            Download
                            <ChevronDownIcon
                              className="-mr-1 ml-2 h-5 w-5"
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
                          <Menu.Items className="z-[9999] origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      await generatePDF(pdfRef, {
                                        filename: tab.name,
                                      });
                                    }}
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    PDF
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="relative flex-1 pb-6 px-4 sm:px-6 h-full overflow-y-auto">
                    <div ref={pdfRef} className="w-full">
                      {/* <div className="px-4 sm:px-6 lg:px-8 w-[100%]">
                       
                        <div className="mt-8 flex flex-col w-[100%]">
                          <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8 w-[100%]">
                            <div className="inline-block py-2 align-middle w-[100%]">
                              <div className="shadow-sm ring-1 ring-black ring-opacity-5 w-[100%]">
                                <table
                                  className="w-[100%] border-separate"
                                  style={{ borderSpacing: 0 }}
                                >
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                      >
                                        Name
                                      </th>
                                      <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                      >
                                        Title
                                      </th>
                                      <th
                                        scope="col"
                                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                                      >
                                        Email
                                      </th>
                                      <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                      >
                                        Role
                                      </th>
                                      <th
                                        scope="col"
                                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                                      >
                                        <span className="sr-only">Edit</span>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white">
                                    {data
                                      .filter((str) =>
                                        strings.some((term) =>
                                          str.message.includes(term)
                                        )
                                      )
                                      .sort(function(a, b) {
                                        return (
                                          new Date(b.date) - new Date(a.date)
                                        );
                                      })
                                      .map((d, index) => (
                                        <tr key={d.email}>
                                          <td
                                            className={classNames(
                                              index !==
                                                data.filter((str) =>
                                                  strings.some((term) =>
                                                    str.message.includes(term)
                                                  )
                                                ).length -
                                                  1
                                                ? "border-b border-gray-200"
                                                : "",
                                              "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                                            )}
                                          >
                                            d.name
                                          </td>
                                          <td
                                            className={classNames(
                                              index !==
                                                data.filter((str) =>
                                                  strings.some((term) =>
                                                    str.message.includes(term)
                                                  )
                                                ).length -
                                                  1
                                                ? "border-b border-gray-200"
                                                : "",
                                              "whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
                                            )}
                                          >
                                            {d.message}
                                          </td>
                                          <td
                                            className={classNames(
                                              index !==
                                                data.filter((str) =>
                                                  strings.some((term) =>
                                                    str.message.includes(term)
                                                  )
                                                ).length -
                                                  1
                                                ? "border-b border-gray-200"
                                                : "",
                                              "whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell"
                                            )}
                                          >
                                            d.email
                                          </td>
                                          <td
                                            className={classNames(
                                              index !==
                                                data.filter((str) =>
                                                  strings.some((term) =>
                                                    str.message.includes(term)
                                                  )
                                                ).length -
                                                  1
                                                ? "border-b border-gray-200"
                                                : "",
                                              "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                            )}
                                          >
                                            d.role
                                          </td>
                                          <td
                                            className={classNames(
                                              index !==
                                                data.filter((str) =>
                                                  strings.some((term) =>
                                                    str.message.includes(term)
                                                  )
                                                ).length -
                                                  1
                                                ? "border-b border-gray-200"
                                                : "",
                                              "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8"
                                            )}
                                          >
                                            <a
                                              href="#"
                                              className="text-indigo-600 hover:text-indigo-900"
                                            >
                                              Edit
                                              <span className="sr-only">
                                                , d.namea
                                              </span>
                                            </a>
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
                      <div className="w-full">
                        <div className="lg:pr-6 w-full px-4">
                          <div className="border rounded-lg border pb-8 border-gray-200">
                            <div className="flex items-center border-b border-gray-200 pt-10 justify-between px-6 py-3">
                              <p className="text-sm lg:text-xl font-semibold leading-tight text-gray-800">
                                Version History
                              </p>
                              <div className="flex cursor-pointer items-center justify-center px-3 py-2.5 border rounded border-gray-100"></div>
                            </div>
                            <div className="px-6 pt-8">
                              {data
                                .filter((str) =>
                                  strings.some((term) =>
                                    str.message.includes(term)
                                  )
                                )
                                .sort(function(a, b) {
                                  return new Date(b.date) - new Date(a.date);
                                })
                                .map((d, index) => (
                                  <div
                                    className={`${index === 0 ? "" : "pt-8"}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <p className="text-xs md:text-sm font-semibold leading-none text-gray-800">
                                          {d.userName}
                                        </p>
                                        <p className="text-xs md:text-sm leading-none text-indigo-500 pl-3">
                                          {d.userEmail}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs md:text-sm leading-none text-right text-gray-600">
                                          {addTime(d.date)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="py-2">
                                      <p className="max-w-[80%] text-xs md:text-sm leading-tight text-gray-600">
                                        {d.message}
                                      </p>
                                    </div>
                                    <div>
                                      {d.anyData &&
                                        d.anyData != "null" &&
                                        JSON.parse(d.anyData) && (
                                          <>
                                            <img
                                              className="w-32 mb-2"
                                              src={JSON.parse(d.anyData).sign}
                                              alt=""
                                            />
                                          </>
                                        )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <ul
                        aria-label="User feed"
                        role="feed"
                        className="relative flex flex-col gap-12 py-12 pl-8 before:absolute before:top-0 before:left-8 before:h-full before:-translate-x-1/2 before:border before:border-dashed before:border-slate-200 after:absolute after:top-6 after:left-8 after:bottom-6 after:-translate-x-1/2 after:border after:border-slate-200 "
                      >
                        {data
                          .filter((str) =>
                            strings.some((term) => str.message.includes(term))
                          )
                          .sort(function(a, b) {
                            return new Date(b.date) - new Date(a.date);
                          })
                          .map((d) => (
                            <li role="article" className="relative pl-8 ">
                              <div className="flex flex-col flex-1 gap-4">
                                <a
                                  href="#"
                                  className="absolute z-10 inline-flex items-center justify-center w-8 h-8 text-white rounded-full -left-4 ring-2 ring-white"
                                >
                                  <img
                                    src={`${userAvatar(d.userName)}`}
                                    alt="user name"
                                    title="user name"
                                    width="48"
                                    height="48"
                                    className="max-w-full rounded-full"
                                  />
                                </a>
                                <h4 className="flex flex-col items-start text-lg font-medium leading-8 text-slate-700 md:flex-row lg:items-center">
                                  <span className="flex-1">
                                    {d.userName}
                                    
                                  </span>
                                  <span className="text-sm font-normal text-slate-400">
                                    {" "}
                                    {addTime(d.date)}
                                  </span>
                                </h4>
                                <p className=" text-slate-500">{d.message}</p>
                                {d.anyData &&
                                  d.anyData != "null" &&
                                  JSON.parse(d.anyData) && (
                                    <>
                                      <img
                                        className="w-32"
                                        src={JSON.parse(d.anyData).sign}
                                        alt=""
                                      />
                                    </>
                                  )}
                              </div>
                            </li>
                          ))}
                      </ul> */}
                    </div>

                    {/* /End replace */}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default EntryVersionHistory;

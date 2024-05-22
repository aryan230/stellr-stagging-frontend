import React from "react";
import { Fragment, useState, useRef } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import moment from "moment";
import { addTime } from "../../Functions/addTime";
import { userAvatar } from "../../Functions/userAvatar";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function EntryTimeline({ open, setOpen, tab, project }) {
  const [data, setData] = useState(tab.logs ? tab.logs : []);

  const strings = [
    "The status of the entity",
    "The entry was submitted for approval",
    "Changed the status of the Entry",
  ];
  //The status of the entity
  //The entry was submitted for approval
  //Changed the status of the Entry

  console.log(
    data.filter((str) => strings.some((term) => str.message.includes(term)))
  );
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
                        Timeline
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
                  </div>
                  <div className="relative flex-1 pb-6 px-4 sm:px-6 h-full overflow-y-auto">
                    {/* Replace with your content */}
                    {/* <div className="max-w-xl p-8 mx-auto">
                      <ul className="space-y-12">
                        {data
                          .filter((str) =>
                            strings.some((term) => str.message.includes(term))
                          )
                          .sort(function(a, b) {
                            return new Date(b.date) - new Date(a.date);
                          })
                          .map((d) => (
                            <li className="flex items-start space-x-3">
                              <a
                                rel="noopener noreferrer"
                                href="#"
                                className="flex items-center h-8 text-sm hover:underline"
                              ></a>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between space-x-4">
                                  <a
                                    rel="noopener noreferrer"
                                    href="#"
                                    className="inline-flex items-center px-3 py-1 my-1 space-x-2 text-sm border rounded-full group"
                                  >
                                    <span
                                      aria-hidden="true"
                                      className="h-1.5 w-1.5 rounded-full"
                                    ></span>
                                    <span className="group-hover:underline">
                                      {d.userName}
                                    </span>
                                  </a>
                                  <span className="text-xs whitespace-nowrap">
                                    {addTime(d.date)}
                                  </span>
                                </div>
                                <div>
                                  <p>{d.message}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div> */}
                    <>
                      {/*<!-- Component: User feed --> */}
                      <ul
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
                                    {/* <span className="text-base font-normal text-slate-500">
                                      {" "}
                                      created a new thread
                                    </span> */}
                                  </span>
                                  <span className="text-sm font-normal text-slate-400">
                                    {" "}
                                    {addTime(d.date)}
                                  </span>
                                </h4>
                                <p className=" text-slate-500">{d.message}</p>
                              </div>
                            </li>
                          ))}
                      </ul>
                      {/*<!-- End User feed --> */}
                    </>

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

export default EntryTimeline;

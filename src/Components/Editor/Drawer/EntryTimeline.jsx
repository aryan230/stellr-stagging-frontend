import React from "react";
import { Fragment, useState, useRef } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import moment from "moment";
import { addTime } from "../../Functions/addTime";

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
                    <div className="max-w-xl p-8 mx-auto">
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

export default EntryTimeline;

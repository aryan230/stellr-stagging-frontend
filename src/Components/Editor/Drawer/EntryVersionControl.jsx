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

function EntryVersionControl({
  open,
  setOpen,
  tab,
  project,
  setViewCurrentV,
  setCurrentVData,
}) {
  const [data, setData] = useState(
    tab.versionControlNew ? tab.versionControlNew : []
  );

  console.log(data);

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
                        Version Control
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
                    <>
                      {/*<!-- Component: User feed --> */}
                      <div className="relative overflow-x-auto">
                        <table className="w-full h-full text-sm text-left rtl:text-right text-gray-500 mt-10">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                            <tr>
                              <th scope="col" className="px-6 py-3">
                                Version name
                              </th>
                              <th scope="col" className="px-6 py-3">
                                Updated By
                              </th>
                              <th scope="col" className="px-6 py-3">
                                View
                              </th>
                              <th scope="col" className="px-6 py-3">
                                Delete
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data
                              .sort(function(a, b) {
                                return new Date(b.date) - new Date(a.date);
                              })
                              .map((d) => (
                                <tr className="bg-white border-b">
                                  <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                  >
                                    {addTime(d.date)}
                                  </th>
                                  <td className="px-6 py-4">{d.userName}</td>
                                  <td className="px-6 py-4">
                                    <a
                                      className="text-indigo-600"
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setOpen(false);
                                        setCurrentVData(d.oldData);
                                        setViewCurrentV(true);
                                      }}
                                    >
                                      View
                                    </a>
                                  </td>
                                  <td className="px-6 py-4">
                                    <a
                                      className="text-red-600"
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setOpen(false);
                                        setCurrentVData(d.oldData);
                                        setViewCurrentV(true);
                                      }}
                                    >
                                      Delete
                                    </a>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

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

export default EntryVersionControl;

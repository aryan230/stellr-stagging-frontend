import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BellIcon, CheckCircleIcon, CheckIcon, Info, X } from "lucide-react";
import moment from "moment";
import { userAvatar } from "../Functions/userAvatar";
import { addTime } from "../Functions/addTime";

function NotificationModal({ open, setOpen, data, setWhichTabisActive }) {
  const people = [
    {
      name: "Lindsay Walton",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    // More people...
  ];
  const activityItems = [
    {
      id: 1,
      person: people[0],
      project: "Workcation",
      commit: "2d89f0c8",
      environment: "production",
      time: "1h",
    },
    // More items...
  ];
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform  rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all w-[80vw] h-full">
                <div className="w-[70%] mx-auto font-dmsans h-[100%]">
                  <h1 className="text-3xl flex items-center justify-center font-body font-bold mb-10 pt-5 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    <BellIcon className="text-indigo-500 mr-5 w-10 h-10" />
                    <span>Your Notification's</span>
                  </h1>
                  {/*<!-- Component: User feed --> */}
                  <ul
                    aria-label="User feed"
                    role="feed"
                    className="relative flex flex-col gap-12 py-12 pl-8 before:absolute before:top-0 before:left-8 before:h-full before:-translate-x-1/2 before:border before:border-dashed before:border-slate-200 after:absolute after:top-6 after:left-8 after:bottom-6 after:-translate-x-1/2 after:border after:border-slate-200 "
                  >
                    {data &&
                      data.length > 0 &&
                      data
                        .sort(function(a, b) {
                          return (
                            new Date(JSON.parse(b.data).date) -
                            new Date(JSON.parse(a.data).date)
                          );
                        })
                        .map((n) =>
                          JSON.parse(n.data).t === "new" ? (
                            <div className="pointer-events-auto w-full rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="p-4">
                                <div className="flex items-start">
                                  <div className="ml-3 w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {JSON.parse(n.data).subject}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {JSON.parse(n.data).date &&
                                        moment(
                                          JSON.parse(n.data).date
                                        ).fromNow()}{" "}
                                    </p>
                                    <div className="mt-4 flex">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          console.log(JSON.parse(n.data).e);
                                          if (
                                            JSON.parse(n.data).e == "protocols"
                                          ) {
                                            setOpen(false);
                                            setWhichTabisActive(
                                              "listProtocols"
                                            );
                                          } else if (
                                            JSON.parse(n.data).e == "sops"
                                          ) {
                                            setOpen(false);
                                            setWhichTabisActive("listSops");
                                          }
                                        }}
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                      >
                                        View
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="pointer-events-auto w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="p-4">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0">
                                    <Info
                                      className="h-6 w-6 text-green-400"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">
                                      {JSON.parse(n.data).subject}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {JSON.parse(n.data).date &&
                                        moment(
                                          JSON.parse(n.data).date
                                        ).fromNow()}{" "}
                                      {/* (
                                    {JSON.parse(n.data).date &&
                                      addTime(JSON.parse(n.data).date)}
                                    ) */}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            // <li role="article" className="relative pl-8 ">
                            //   <div className="flex flex-col flex-1 gap-4">
                            //     <a
                            //       href="#"
                            //       className="absolute z-10 inline-flex items-center justify-center w-8 h-8 text-white rounded-full -left-4 ring-2 ring-white"
                            //     >
                            //       <img
                            //         src={userAvatar(
                            //           JSON.parse(n.data).subject &&
                            //             JSON.parse(n.data)
                            //               .subject.toString()
                            //               .split("by ")[1]
                            //         )}
                            //         alt="user name"
                            //         title="user name"
                            //         width="48"
                            //         height="48"
                            //         className="max-w-full rounded-full"
                            //       />
                            //     </a>
                            //     <h4 className="flex flex-col items-start text-lg font-medium leading-8 text-slate-700 md:flex-row lg:items-center">
                            //       <span className="flex-1">
                            //         {JSON.parse(n.data).subject &&
                            //           JSON.parse(n.data)
                            //             .subject.toString()
                            //             .split("by ")[1]}
                            //       </span>
                            //       <span className="text-sm font-normal text-slate-400">
                            //         {" "}
                            //         {JSON.parse(n.data).date &&
                            //           moment(JSON.parse(n.data).date).fromNow()}
                            //       </span>
                            //     </h4>
                            //     <p className=" text-slate-500">
                            //       {JSON.parse(n.data).subject}{" "}
                            //     </p>
                            //   </div>
                            // </li>
                          )
                        )}
                    //emily
                    {/* <div className="pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="w-0 flex-1 p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            <img
                              className="h-10 w-10 rounded-full"
                              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                              alt=""
                            />
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Emilia Gates
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Sure! 8:30pm works great!
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex border-l border-gray-200">
                        <button
                          type="button"
                          className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onClick={() => {
                            // setShow(false);
                          }}
                        >
                          Reply
                        </button>
                      </div>
                    </div> */}
                  </ul>
                  {/*<!-- End User feed --> */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default NotificationModal;

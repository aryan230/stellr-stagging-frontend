import React from "react";
import generatePDF from "react-to-pdf";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { addTime } from "../../../Functions/addTime";
import { PaperClipIcon } from "@heroicons/react/solid";
import CompleteLoader from "../../../Loaders/CompleteLoader";
import SecondLoaderWithText from "../../../Loaders/SecondLoaderWithText";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function TopDataReport({ data, pdfRef }) {
  return (
    <>
      <div className="view-report-details-tp">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Report name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {data.name}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Report Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {data.description}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Created on
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {addTime(data.createdAt)}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Last Updated on
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {addTime(data.updatedAt)}
                </dd>
              </div>

              <div
                className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                id="download-btn-report-1"
              >
                <dt className="text-sm font-medium text-gray-500">
                  Download Report
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul
                    role="list"
                    className="border border-gray-200 rounded-md divide-y divide-gray-200"
                  >
                    <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <PaperClipIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-2 flex-1 w-0 truncate">pdf</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          onClick={async (e) => {
                            e.preventDefault();
                            document.getElementById(
                              "download-btn-report-1"
                            ).style.display = "none";
                            await generatePDF(pdfRef, { filename: data.name });
                            document.getElementById(
                              "download-btn-report-1"
                            ).style.display = "grid";
                          }}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                    <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <PaperClipIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-2 flex-1 w-0 truncate">csv</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* <Menu
          as="div"
          className="relative inline-block text-left z-[99999]"
          id="download-btn-report"
        >
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
              Download Report
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
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={async (e) => {
                        e.preventDefault();
                        document.getElementById(
                          "download-btn-report"
                        ).style.display = "none";
                        await generatePDF(pdfRef, { filename: data.name });
                        document.getElementById(
                          "download-btn-report"
                        ).style.display = "inline-flex";
                      }}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
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
        </Menu> */}
        {/* <button onClick={() => generatePDF(pdfRef, { filename: "page.pdf" })}>
        download
      </button> */}
      </div>
      <div className="w-[80%] mx-auto pt-4">
        {/* <button
          onClick={async () => {
            document.getElementById("download-btn-report").style.display =
              "none";
            await generatePDF(pdfRef, { filename: data.name });
            document.getElementById("download-btn-report").style.display =
              "inline-flex";
          }}
          type="button"
          id="download-btn-report"
          className="px-3 py-2 text-sm font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-blue-300"
        >
          Download
          <svg
            className="ml-2"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.33926 10.0969L9.34453 10.0723C9.44648 9.65215 9.5748 9.12832 9.47461 8.65371C9.40781 8.2793 9.13184 8.1334 8.89629 8.12285C8.61855 8.11055 8.3707 8.26875 8.30918 8.49902C8.19316 8.9209 8.29687 9.49746 8.48672 10.2322C8.24766 10.8018 7.86621 11.6297 7.58672 12.1219C7.06641 12.3908 6.36855 12.8057 6.26484 13.3295C6.24375 13.4262 6.26836 13.5492 6.32637 13.66C6.39141 13.783 6.49512 13.8779 6.61641 13.9236C6.66914 13.943 6.73242 13.9588 6.80625 13.9588C7.11563 13.9588 7.6166 13.7092 8.28457 12.5631C8.38652 12.5297 8.49199 12.4945 8.59395 12.4594C9.07207 12.2977 9.56777 12.1289 10.016 12.0533C10.5117 12.3188 11.076 12.4893 11.4592 12.4893C11.8389 12.4893 11.9883 12.2643 12.0445 12.1289C12.143 11.8916 12.0955 11.5928 11.9355 11.4328C11.7035 11.2043 11.1393 11.1445 10.2604 11.2535C9.82793 10.9898 9.54492 10.6313 9.33926 10.0969ZM7.41094 12.767C7.1666 13.1221 6.98203 13.2996 6.88184 13.377C6.99961 13.1607 7.22988 12.9322 7.41094 12.767ZM8.95078 8.62734C9.04219 8.78379 9.02988 9.25664 8.95957 9.4957C8.87344 9.1459 8.86113 8.6502 8.91211 8.59219C8.92617 8.59395 8.93848 8.60449 8.95078 8.62734ZM8.92266 10.7455C9.11074 11.0707 9.34805 11.3502 9.60996 11.5576C9.23027 11.6438 8.88398 11.7861 8.57461 11.9127C8.50078 11.9426 8.42871 11.9725 8.3584 12.0006C8.59219 11.577 8.7873 11.0971 8.92266 10.7455V10.7455ZM11.6578 11.8969C11.6596 11.9004 11.6613 11.9057 11.6508 11.9127H11.6473L11.6438 11.918C11.6297 11.9268 11.4855 12.0111 10.865 11.7668C11.5787 11.7334 11.6561 11.8951 11.6578 11.8969V11.8969ZM15.0223 5.07305L11.2395 1.29023C11.134 1.18477 10.9916 1.125 10.8422 1.125H3.375C3.06387 1.125 2.8125 1.37637 2.8125 1.6875V16.3125C2.8125 16.6236 3.06387 16.875 3.375 16.875H14.625C14.9361 16.875 15.1875 16.6236 15.1875 16.3125V5.47207C15.1875 5.32266 15.1277 5.17852 15.0223 5.07305V5.07305ZM13.8902 5.73047H10.582V2.42227L13.8902 5.73047ZM13.9219 15.6094H4.07812V2.39062H9.38672V6.1875C9.38672 6.3833 9.4645 6.57109 9.60296 6.70954C9.74141 6.848 9.9292 6.92578 10.125 6.92578H13.9219V15.6094Z"
              fill="white"
            />
          </svg>
        </button> */}
      </div>
    </>
  );
}

export default TopDataReport;

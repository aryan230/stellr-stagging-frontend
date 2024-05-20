import React, { useState } from "react";
import Pagination from "./Pagination";
import { Disclosure } from "@headlessui/react";
import CompleteLoader from "../Loaders/CompleteLoader";
import { ChevronDownIcon, Folders } from "lucide-react";
import { addTime } from "../Functions/addTime";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function PageMain({ data, type, openAnEntity, extra, icon }) {
  console.log(data);
  return (
    <div className="h-[90%]">
      <div className="flex flex-col mt-10 h-[100%]">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 h-[100%]">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 h-[100%]">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg h-[100%] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200 overflow-y-auto">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    {extra &&
                      extra.map((e) => (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {e.name}
                        </th>
                      ))}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created On
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last updated on
                    </th>

                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((p) => (
                    <tr key={p._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center justify-left font-medium text-gray-900">
                        {icon}
                        {p.name}
                      </td>
                      {extra &&
                        extra.map((e) => {
                          return (
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {p[e.slug]}
                            </th>
                          );
                        })}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {addTime(p.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {addTime(p.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (type === "entries") {
                              openAnEntity(type, p);
                            } else {
                              openAnEntity(type, p.data);
                            }
                          }}
                          type="button"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View
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
    </div>
  );
}

export default PageMain;

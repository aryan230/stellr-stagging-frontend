import React, { useState, Fragment } from "react";
import MainModalEntity from "../../UI/MainModals/MainModalEntity";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ChevronRightIcon,
  DotsVerticalIcon,
  SearchIcon,
  SelectorIcon,
} from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function SampleTemplateModal({
  sampleTemplateModal,
  setSampleTemplateModal,
  data,
}) {
  const [customSampleData, setCustomSampleData] = useState(
    JSON.parse(data.data) ? JSON.parse(data.data) : []
  );
  console.log(data);
  return (
    <MainModalEntity
      open={sampleTemplateModal}
      setOpen={setSampleTemplateModal}
    >
      <ul role="list" className="divide-y divide-gray-200">
        {customSampleData && customSampleData.length > 0 ? (
          customSampleData.map((d) => (
            <li
              key={d.id}
              className="relative col-span-1 flex shadow-sm rounded-md my-2"
            >
              <div
                className={classNames(
                  "bg-indigo-600",
                  "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
                )}
              >
                {d.name.match(/\b(\w)/g).join("")}
              </div>
              <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                <div className="flex-1 px-4 py-2 text-sm truncate">
                  <a
                    href="#"
                    className="text-gray-900 font-medium hover:text-gray-600 font-body"
                  >
                    {d.name}
                  </a>
                  <p className="text-gray-500 font-karla">{d.type}</p>
                </div>
                {/* <Menu as="div" className="flex-shrink-0 pr-2">
                  <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none">
                    <span className="sr-only">Open options</span>
                    <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="z-10 mx-3 origin-top-right absolute right-10 top-3 w-48 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                      <div className="py-1">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCustomSampleData((current) =>
                                    current.filter((f) => {
                                      return f.id != d.id;
                                    })
                                  );
                                }}
                              >
                                Remove from Template
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu> */}
              </div>
            </li>
          ))
        ) : (
          <div className="w-[100%] h-full flex-col items-center justify-center">
            <img
              src="https://niceillustrations.com/wp-content/themes/illustrater/assets/images/no-result.png"
              alt=""
              className="w-48"
            />
            <span>No fields added, you can add upto five fields.</span>
          </div>
        )}
      </ul>
    </MainModalEntity>
  );
}

export default SampleTemplateModal;

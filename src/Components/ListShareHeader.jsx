import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";

function ListShareHeader({ name, onClick, nav, setNav }) {
  return (
    <div>
      <div>
        <nav className="sm:hidden" aria-label="Back">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setNav(0);
            }}
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
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setNav(0);
                  }}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
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
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {name}
                </a>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      <div className="mt-2 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate font-[Gotham-Black] bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
            {name}
          </h2>
        </div>
        <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4"></div>
      </div>
    </div>
  );
}

export default ListShareHeader;

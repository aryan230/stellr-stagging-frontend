import React, { useState } from "react";
import TimezoneSelect from "react-timezone-select";

export const finalTime = async (date) => {
  const finalDate = new Date(date).toDateString();
  console.log(finalDate);
  return "";
};

export function TimezoneSelectMain({ setTimezone, time, setChangeTime }) {
  const [selectedTimezone, setSelectedTimezone] = useState(time && time.value);
  return (
    <div className="modal">
      <div className="relative w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow">
          {/* Modal header */}
          <div className="flex items-start justify-between p-4 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              Change Timezone Settings
            </h3>
            <button
              onClick={(e) => {
                e.preventDefault();
                setTimezone(false);
              }}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
              data-modal-hide="defaultModal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-6 space-y-6">
            <div className="font-body">
              <TimezoneSelect
                value={selectedTimezone}
                onChange={setSelectedTimezone}
              />
            </div>
          </div>
          {/* Modal footer */}
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                localStorage.setItem(
                  "stellrtimezone",
                  JSON.stringify(selectedTimezone)
                );
                setTimezone(false);
                setChangeTime(true);
              }}
              data-modal-hide="defaultModal"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Save
            </a>
            <button
              data-modal-hide="defaultModal"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setTimezone(false);
              }}
              className="text-gray-500 bg-white hover:bg-gray-100 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

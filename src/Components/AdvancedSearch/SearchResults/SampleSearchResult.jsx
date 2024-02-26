import React from "react";
import { addTime } from "../../Functions/addTime";

function SampleSearchResult({
  sample,
  index,
  responseType,
  setSampleContent,
  setSampleModal,
}) {
  const date = new Date(sample.createdAt);
  return (
    <tr className="h-20 text-sm leading-none text-gray-800 border-b border-gray-100">
      <td className="pl-8">{sample._id}</td>
      <td className="font-medium px-10 lg:px-6 xl:px-0">
        {JSON.parse(sample.data).sampleName}
        {/* <p className="text-gray-600 font-normal mt-2">PID: 982 0192</p> */}
      </td>
      <td className="px-10 lg:px-6 xl:px-0">{responseType}</td>
      <td className="font-medium px-10 lg:px-6 xl:px-0">{addTime(date)}</td>
      <td className="px-10 lg:px-6 xl:px-0">
        <p className="underline text-blue-500">{addTime(sample.updatedAt)}</p>
      </td>
      <td className="px-10 lg:px-6 xl:px-0">
        <div className="flex items-center justify-center w-20 h-6 bg-yellow-100 rounded-full">
          <button
            onClick={async (e) => {
              e.preventDefault();
              setSampleContent(sample);
              setSampleModal(true);
            }}
            className="flex items-center justify-center px-4 py-3 w-32 h-9 bg-indigo-50 hover:bg-indigo-100 rounded focus:outline-none"
          >
            <p className="text-sm leading-none text-indigo-700">Open</p>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default SampleSearchResult;

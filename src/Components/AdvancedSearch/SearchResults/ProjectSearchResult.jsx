import React from "react";
import { addTime } from "../../Functions/addTime";

function ProjectSearchResult({
  project,
  index,
  responseType,
  setWhichTabisActive,
  setProjectInsideActiveId,
  setProjectInsideActive,
}) {
  const date = new Date(project.createdAt);
  return (
    <tr className="h-20 text-sm leading-none text-gray-800 border-b border-gray-100">
      <td className="pl-8">{project._id}</td>
      <td className="font-medium px-10 lg:px-6 xl:px-0">
        {project.name}
        {/* <p className="text-gray-600 font-normal mt-2">PID: 982 0192</p> */}
      </td>
      <td className="px-10 lg:px-6 xl:px-0">{responseType}</td>
      <td className="font-medium px-10 lg:px-6 xl:px-0">{addTime(date)}</td>
      <td className="px-10 lg:px-6 xl:px-0">
        <p className="underline text-blue-500">{addTime(project.updatedAt)}</p>
      </td>
      <td className="px-10 lg:px-6 xl:px-0">
        <div className="flex items-center justify-center w-20 h-6 bg-yellow-100 rounded-full">
          <button
            onClick={async (e) => {
              e.preventDefault();
              setProjectInsideActiveId(project._id);
              setProjectInsideActive(true);
              setWhichTabisActive("projectList");
            }}
            className="flex items-center justify-center px-4 py-3 w-32 h-9 bg-indigo-50 hover:bg-indigo-100 rounded focus:outline-none"
          >
            <p className="text-sm leading-none text-indigo-700">Open</p>
          </button>
        </div>
      </td>
    </tr>
    // <tr className="bg-white border-b">
    //   <th
    //     scope="row"
    //     className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
    //   >
    //     {project._id}
    //   </th>
    //   <td className="px-6 py-4">{}</td>
    //   <td className="px-6 py-4">{responseType}</td>
    //   <td className="px-6 py-4">{date.toLocaleString()}</td>
    //   <td className="px-6 py-4">{project.updatedAt}</td>
    //   <td className="px-6 py-4">
    //     <a
    //       href="#"
    //       className="text-indigo-600"
    //       onClick={async (e) => {
    //         e.preventDefault();
    //         setProjectInsideActiveId(project._id);
    //         setProjectInsideActive(true);
    //         setWhichTabisActive("projectList");
    //       }}
    //     >
    //       View
    //     </a>
    //   </td>
    // </tr>
  );
}

export default ProjectSearchResult;

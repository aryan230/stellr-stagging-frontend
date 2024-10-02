import React from "react";
import BasicModalTailwind from "../../UI/MainModals/BasicModalTailwind";

function ShareUserRole({
  role,
  setRole,
  roleModal,
  setRoleModal,
  mainFunction,
}) {
  return (
    <BasicModalTailwind open={roleModal} setOpen={setRoleModal}>
      <div className="font-dmsans">
        {" "}
        <h1 className="font-black text-xl mb-5 font-ptsans text-gray-700">
          Select role for the user
        </h1>
        <div>
          <label
            htmlFor="email"
            className="block text-base font-medium text-gray-700"
          >
            Select access
          </label>
          <select
            id="location"
            name="location"
            className="block mt-1 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base border-gray-300 rounded-md"
            onChange={(e) => {
              setRole(e.target.value);
            }}
            defaultValue="view"
          >
            <option value="Read">Read</option>
            <option value="Write">Write</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-5">
          <div className="flex">
            <div className="ml-3">
              <p className="text-base text-yellow-700">
                The user will be able to <br />
                <a
                  href="#"
                  className="font-medium underline text-yellow-700 hover:text-yellow-600"
                >
                  edit{" "}
                </a>
                the entity.
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setRoleModal(false);
            mainFunction();
          }}
          className="inline-flex mt-5 items-center px-3 py-2 border border-transparent text-base leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </BasicModalTailwind>
  );
}

export default ShareUserRole;

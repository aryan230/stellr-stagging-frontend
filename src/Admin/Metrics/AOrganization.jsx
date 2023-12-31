import React from "react";

function AOrganization({ data }) {
  return (
    <div className="relative overflow-x-auto px-10 h-[80%]">
      <table className="w-full text-sm text-left text-gray-500 h-[100%]">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Created By User
            </th>
            <th scope="col" className="px-6 py-3">
              Created On
            </th>
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
          {data.organizations &&
            data.organizations.map((e) => (
              <tr className="bg-white border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {e._id}
                </th>
                <td className="px-6 py-4">{e.name}</td>
                <td className="px-6 py-4">
                  {data.users.find((b) => b._id == e.user)
                    ? data.users.find((b) => b._id == e.user).email
                    : "Deactivated User"}
                </td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="text-indigo-600"
                    onClick={async (e) => {
                      e.preventDefault();
                    }}
                  >
                    {
                      new Date(e.createdAt)
                        .toLocaleString("en-GB")
                        .split(",")[0]
                    }
                    , {new Date(e.createdAt).toLocaleString().split(",")[1]}
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default AOrganization;

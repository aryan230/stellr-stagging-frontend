import { Chip } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";

function InsideUsers({ e, data }) {
  const [orgData, setOrg] = useState();
  let lastOnline =
    e.activeStatus.length > 0 ? e.activeStatus.slice(-1)[0].date : "Not Active";
  let org = data && data.organizations.find((b) => b.user == e._id);

  const findOrgCollab = async () => {
    data.organizations.forEach((element) => {
      if (element.collaborators.find((a) => a.user == e._id)) {
        setOrg(element);
      }
    });
  };

  useEffect(() => {
    findOrgCollab();
  }, []);
  console.log(
    lastOnline &&
      moment(lastOnline)
        .locale("en-in")
        .format("LT")
  );
  // const time = moment(d.date).format("LT");
  return (
    <tr className="bg-white border-b">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        {e._id}
      </th>
      <td className="px-6 py-4">{e.name}</td>
      <td className="px-6 py-4">{e.email}</td>
      <td className="px-6 py-4">{e.isAdmin ? "Admin" : "Not an Admin"}</td>
      <td className="px-6 py-4">
        {org && org.name} {orgData && orgData.name}{" "}
        {!org && !orgData && "Not Created/Joined an Organization."}
      </td>
      <td className="px-6 py-4">{e.deactivated ? "Deactivated" : "Active"}</td>
      <td className="px-6 py-4">
        <a
          href="#"
          className="text-gray-600"
          onClick={async (e) => {
            e.preventDefault();
          }}
        >
          {lastOnline == "Not Active"
            ? "Not Active"
            : `${moment(new Date(lastOnline)).format("DD/MM/YYYY")}`}

          {/* {e.activeStatus.length > 0 ? (
            e.activeStatus
              .slice(-1)
              .date.toLocaleString("en-GB")
              .split(",")[0]
          ) : (
            <Chip label="Inactive" color="warning" />
          )} */}
        </a>
      </td>
    </tr>
  );
}

export default InsideUsers;

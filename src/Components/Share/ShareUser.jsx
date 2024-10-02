import { PlusIcon, User, UserX } from "lucide-react";
import React, { useState } from "react";
import ShareUserRole from "./ShareUserRole";
import { addNotification } from "../Functions/addNotification";

function ShareUser({
  findOrg,
  updateShare,
  share,
  userInfo,
  ownerUserData,
  type,
  customCollabs,
  id,
}) {
  const [user, setUser] = useState();
  const [role, setRole] = useState("view");
  const [roleModal, setRoleModal] = useState(false);

  const mainFunction = async () => {
    if (share) {
      if (share.users) {
        let old = share;
        let u1 =
          (await findOrg) && findOrg.collaborators.find((c) => c.user === user);
        let u2 =
          (await customCollabs) && customCollabs.find((c) => c.user === user);
        if (u1) {
          let u = u1;
          u.access = role;
          old.users.push(u);
          var Newdata = JSON.stringify({
            share: JSON.stringify(old),
          });

          updateShare(Newdata, u.user, role);
        } else {
          let u = u2;
          u.access = role;
          old.users.push(u);
          var Newdata = JSON.stringify({
            share: JSON.stringify(old),
          });

          updateShare(Newdata, u.user, role);
        }
      } else {
        let old = share;
        let u1 =
          (await findOrg) && findOrg.collaborators.find((c) => c.user === user);
        let u2 =
          (await customCollabs) && customCollabs.find((c) => c.user === user);
        if (u1) {
          let u = u1;
          u.access = role;
          old.users.push(u);
          var Newdata = JSON.stringify({
            share: JSON.stringify(old),
          });

          updateShare(Newdata, u.user, role);
        } else {
          let u = u2;
          u.access = role;
          old.users.push(u);
          var Newdata = JSON.stringify({
            share: JSON.stringify(old),
          });

          updateShare(Newdata, u.user, role);
        }
      }
    } else {
      let u1 =
        (await findOrg) && findOrg.collaborators.find((c) => c.user === user);
      let u2 =
        (await customCollabs) && customCollabs.find((c) => c.user === user);
      if (u1) {
        let u = u1;
        u.access = role;
        let newData = {
          value: "650b013f2bc72230ddaff4be",
          users: [u],
          links: [],
        };
        var Newdata = JSON.stringify({
          share: JSON.stringify(newData),
        });

        updateShare(Newdata, u.user, role);
      } else {
        let u = u2;
        u.access = role;
        let newData = {
          value: "650b013f2bc72230ddaff4be",
          users: [u],
          links: [],
        };
        var Newdata = JSON.stringify({
          share: JSON.stringify(newData),
        });

        updateShare(Newdata, u.user, role);
      }
    }
  };
  return (
    <div className="space-y-2 mt-8 max-w-5xl mx-auto px-4 pb-12 sm:px-6 lg:px-8">
      <ShareUserRole
        role={role}
        setRole={setRole}
        roleModal={roleModal}
        setRoleModal={setRoleModal}
        mainFunction={mainFunction}
      />
      <div className="space-y-1">
        <label
          htmlFor="add-team-members"
          className="block text-sm font-medium text-gray-700"
        >
          Add Team Members
        </label>
        <p id="add-team-members-helper" className="sr-only">
          Search by email address
        </p>
        <div className="flex">
          <div className="flex-grow">
            <div>
              <select
                id="location"
                name="location"
                className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                onChange={(e) => {
                  setUser(e.target.value);
                }}
              >
                <option selected disabled>
                  -- select user --
                </option>
                {type === "entries"
                  ? customCollabs.map((c) => (
                      <option value={c.user}>{c.userName}</option>
                    ))
                  : ownerUserData && share
                  ? findOrg.collaborators
                      .filter(
                        (elem) =>
                          !share.users.find(({ user }) => elem.user === user)
                      )
                      .map((c) => <option value={c.user}>{c.userName}</option>)
                  : findOrg.collaborators.map((c) => (
                      <option value={c.user}>{c.userName}</option>
                    ))}
              </select>
            </div>
          </div>
          <span className="ml-3">
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                setRoleModal(true);
              }}
              className="bg-white inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon
                className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span>Add</span>
            </button>
          </span>
        </div>
      </div>

      {share && share.users && share.users.length > 0 ? (
        <div className="border-b border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {share.users.map((person) => (
              <li
                key={person.user}
                className="flex justify-between w-full items-center"
              >
                <div className="flex py-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${person.userName}`}
                    alt=""
                  />
                  <div className="ml-3 flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {person.userName} ({person.access})
                    </span>
                    <span className="text-sm text-gray-500">
                      {person.userEmail}
                    </span>
                  </div>
                </div>
                <div className="">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      let old = share;
                      old.users.splice(
                        old.users.findIndex((a) => a.user === person.user),
                        1
                      );
                      var Newdata = JSON.stringify({
                        share: JSON.stringify(old),
                      });
                      console.log(old);
                      updateShare(Newdata);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center">
          <UserX className="mx-auto h-12 w-12 text-gray-400 mt-10" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No shared users.
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new user.
          </p>
        </div>
      )}
    </div>
  );
}

export default ShareUser;

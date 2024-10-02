import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch, Combobox } from "@headlessui/react";
import { ChevronsUpDownIcon, CheckIcon } from "lucide-react";
import MainModalEntity from "../../UI/MainModals/MainModalEntity";
import { userAvatar } from "../Functions/userAvatar";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function AdvancedSecuritySettings({
  open,
  setOpen,
  findOrg,
  share,
  updateShare,
}) {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [allowdtoLogs, setAllowedtoLogs] = useState(true);
  const [allowedtoEdit, setAllowedtoEdit] = useState(false);
  const [allowedtToArchive, setAllowedtToArchive] = useState(false);
  const [allowedtoNotification, setAllowedtoNotification] = useState(true);
  const [allowedtoShare, setAllowedtoShare] = useState(true);
  const [people, setPeople] = useState(
    share?.users?.map(({ user, userName, ...rest }) => ({
      name: userName,
      id: user,
      imageUrl: userAvatar(userName),
      ...rest,
    })) || []
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (selectedPerson) {
      // Initialize the permission states based on the selected person
      setAllowedtoLogs(selectedPerson?.iData?.logs || false);
      setAllowedtoEdit(selectedPerson?.iData?.edit || false);
      setAllowedtToArchive(selectedPerson?.iData?.archive || false);
      setAllowedtoNotification(selectedPerson?.iData?.notification || false);
      setAllowedtoShare(selectedPerson?.iData?.share || false);
    }
  }, [selectedPerson]); // This effect runs whenever `selectedPerson` changes

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) =>
          person.name.toLowerCase().includes(query.toLowerCase())
        );

  const submitBtn = async () => {
    if (!selectedPerson) {
      toast.error("Please select a user.");
      return;
    }

    try {
      let old = share;
      let users = old.users;
      let u = users.find((c) => c.user === selectedPerson.id);

      if (!u) {
        throw new Error("User not found");
      }

      users = users.filter((item) => item.user !== selectedPerson.id);
      u.iData = {
        logs: allowdtoLogs,
        archive: allowedtToArchive,
        edit: allowedtoEdit,
        notification: allowedtoNotification,
        share: allowedtoShare,
      };

      users.push(u);
      old.users = users;
      const Newdata = JSON.stringify({ share: JSON.stringify(old) });

      await updateShare(Newdata);
      setOpen(false);
      toast.success("Updated successfully");
    } catch (error) {
      toast.error(`Error updating share settings: ${error.message}`);
    }
  };

  return (
    <MainModalEntity open={open} setOpen={setOpen}>
      <div className="max-w-3xl mx-auto py-10">
        {people && (
          <Combobox
            as="div"
            value={selectedPerson}
            onChange={setSelectedPerson}
          >
            <Combobox.Label className="block text-sm font-medium text-gray-700">
              Select user
            </Combobox.Label>
            <div className="relative mt-1">
              <Combobox.Input
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(person) => person?.name}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronsUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>

              {filteredPeople.length > 0 && (
                <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredPeople.map((person) => (
                    <Combobox.Option
                      key={person.id}
                      value={person}
                      className={({ active }) =>
                        classNames(
                          "relative cursor-default select-none py-2 pl-3 pr-9",
                          active ? "bg-indigo-600 text-white" : "text-gray-900"
                        )
                      }
                    >
                      {({ active, selected }) => (
                        <>
                          <div className="flex items-center">
                            <img
                              src={person.imageUrl}
                              alt=""
                              className="h-6 w-6 flex-shrink-0 rounded-full"
                            />
                            <span
                              className={classNames(
                                "ml-3 truncate",
                                selected && "font-semibold"
                              )}
                            >
                              {person.name}
                            </span>
                          </div>
                          {selected && (
                            <span
                              className={classNames(
                                "absolute inset-y-0 right-0 flex items-center pr-4",
                                active ? "text-white" : "text-indigo-600"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}
            </div>
          </Combobox>
        )}

        {selectedPerson && (
          <>
            <div className="px-4 sm:px-6 mt-10">
              <div>
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                  Set privacy settings for {selectedPerson.name}
                </h2>
                <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-0.5 text-sm font-medium text-pink-800">
                  {selectedPerson.access}
                </span>
              </div>

              <ul role="list" className="mt-2 divide-y divide-gray-200">
                {/* Allowed to view logs */}
                <Switch.Group
                  as="li"
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex flex-col">
                    <Switch.Label
                      as="p"
                      className="text-sm font-medium text-gray-900"
                      passive
                    >
                      Allowed to archive
                    </Switch.Label>
                    <Switch.Description className="text-sm text-gray-500">
                      Grants users permission to archive entity.
                    </Switch.Description>
                  </div>
                  <Switch
                    checked={allowedtToArchive}
                    onChange={setAllowedtToArchive}
                    className={classNames(
                      allowedtToArchive ? "bg-indigo-500" : "bg-gray-200",
                      "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        allowedtToArchive ? "translate-x-5" : "translate-x-0",
                        "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </Switch.Group>
                <Switch.Group
                  as="li"
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex flex-col">
                    <Switch.Label
                      as="p"
                      className="text-sm font-medium text-gray-900"
                      passive
                    >
                      Allowed to view logs
                    </Switch.Label>
                    <Switch.Description className="text-sm text-gray-500">
                      Grants users permission to access activity logs and track
                      actions taken within the app.
                    </Switch.Description>
                  </div>
                  <Switch
                    checked={allowdtoLogs}
                    onChange={setAllowedtoLogs}
                    className={classNames(
                      allowdtoLogs ? "bg-indigo-500" : "bg-gray-200",
                      "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        allowdtoLogs ? "translate-x-5" : "translate-x-0",
                        "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </Switch.Group>
                {/* Other switches can be added similarly */}
              </ul>
            </div>
            <div className="flex-shrink-0 px-4 py-4 flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  submitBtn();
                }}
                className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </MainModalEntity>
  );
}

export default AdvancedSecuritySettings;

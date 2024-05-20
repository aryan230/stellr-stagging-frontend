import React, { useState } from "react";
import MainModalEntity from "../../../../UI/MainModals/MainModalEntity";
import SecondLoaderWithText from "../../../Loaders/SecondLoaderWithText";
import { Code, LayoutPanelTopIcon, Plus, X } from "lucide-react";
import { Fragment } from "react";
import {
  Disclosure,
  Menu,
  Popover,
  RadioGroup,
  Switch,
  Transition,
} from "@headlessui/react";
import { QuestionMarkCircleIcon, SearchIcon } from "@heroicons/react/solid";
import {
  BellIcon,
  ChevronDownIcon,
  CogIcon,
  CreditCardIcon,
  DotsVerticalIcon,
  KeyIcon,
  MenuIcon,
  UserCircleIcon,
  ViewGridAddIcon,
  XIcon,
} from "@heroicons/react/outline";
import CustomFieldTemplateP from "./CustomFieldTemplateP";
import axios from "axios";
import URL from "./../../../../Data/data.json";
import { toast } from "sonner";
import { useSelector } from "react-redux";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function CustomProtocolTemplate({ open, setOpen, setCreateNewProtocol }) {
  const [customFeild, setCustomFeild] = useState(false);
  const [loader, setLoader] = useState(false);
  const [customSampleData, setCustomSampleData] = useState([
    {
      name: "Title",
      slug: "title",
      id: "34",
      type: "Text",
      placeholder: "Protocol Title",
    },
  ]);
  const [name, setName] = useState();
  const [description, setDescription] = useState();

  const userLogin = useSelector((state) => state.userLogin);
  let { loading, error, userInfo } = userLogin;

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (customSampleData.length < 2) {
      toast.error("Please add atleast 2 fields to create a template");
      setLoader(false);
      return;
    }
    console.log(name, customSampleData);
    var data = JSON.stringify({
      name,
      description,
      type: "protocol",
      data: JSON.stringify(customSampleData),
    });

    var config = {
      method: "post",
      url: `${URL[0]}api/sampleTemplates`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then(function(response) {
        setLoader(false);
        toast.success(`Custom Protocol with ${name} was successfully created`);
        setOpen(false);
        setCreateNewProtocol(false);
      })
      .catch(function(error) {
        setLoader(false);
        console.log(error);
      });
  };

  return (
    <MainModalEntity open={open} setOpen={setOpen} width="80vw">
      {" "}
      <div className="bg-gray-50 relative">
        {loader && (
          <SecondLoaderWithText text="Generating your protocol template" />
        )}

        <CustomFieldTemplateP
          customFeild={customFeild}
          setCustomFeild={setCustomFeild}
          customSampleData={customSampleData}
          setCustomSampleData={setCustomSampleData}
        />

        <div
          className="absolute top-5 right-5"
          onClick={(e) => {
            setOpen(false);
          }}
        >
          <X className="text-gray-600 w-7 h-7" />
        </div>
        <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8 font-dmsans">
          <>
            <div className="h-full">
              <main className="max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
                  <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
                    <nav className="space-y-1">
                      {customSampleData && customSampleData.length > 0 ? (
                        customSampleData.map((d) => (
                          <li
                            key={d.id}
                            className="relative col-span-1 flex shadow-sm rounded-md"
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
                                <p className="text-gray-500 font-karla">
                                  {d.type}
                                </p>
                              </div>
                              <Menu as="div" className="flex-shrink-0 pr-2">
                                <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none">
                                  <span className="sr-only">Open options</span>
                                  <DotsVerticalIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
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
                              </Menu>
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
                          <span>
                            No fields added, you can add upto five fields.
                          </span>
                        </div>
                      )}
                    </nav>
                  </aside>

                  {/* Payment details */}
                  <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
                    <section aria-labelledby="payment-details-heading">
                      <form>
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                          <div className="bg-white py-6 px-4 sm:p-6">
                            <div>
                              <h2
                                id="payment-details-heading"
                                className="text-lg leading-6 font-medium text-gray-900"
                              >
                                Create custom protocol template
                              </h2>
                            </div>
                            <div className="mt-8">
                              <label
                                htmlFor="first-name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="cc-given-name"
                                onChange={(e) => {
                                  setName(e.target.value);
                                }}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                              />
                            </div>
                            <div className="mt-5">
                              <label
                                htmlFor="first-name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Description
                              </label>
                              <textarea
                                name="first-name"
                                id="first-name"
                                onChange={(e) => {
                                  setDescription(e.target.value);
                                }}
                                autoComplete="cc-given-name"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                              />
                            </div>
                            <div className="mt-5">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCustomFeild(true);
                                }}
                                className="bg-gray-800 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                              >
                                Add field
                              </button>
                            </div>
                          </div>
                          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <button
                              onClick={(e) => {
                                handleSaveTemplate(e);
                              }}
                              className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                            >
                              Create
                            </button>
                          </div>
                        </div>
                      </form>
                    </section>

                    {/* Plan */}
                    {/* <section aria-labelledby="plan-heading">
                      <form action="#" method="POST">
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                          <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                            <div>
                              <h2
                                id="plan-heading"
                                className="text-lg leading-6 font-medium text-gray-900"
                              >
                                Plan
                              </h2>
                            </div>

                            <RadioGroup
                              value={selectedPlan}
                              onChange={setSelectedPlan}
                            >
                              <RadioGroup.Label className="sr-only">
                                Pricing plans
                              </RadioGroup.Label>
                              <div className="relative bg-white rounded-md -space-y-px">
                                {plans.map((plan, planIdx) => (
                                  <RadioGroup.Option
                                    key={plan.name}
                                    value={plan}
                                    className={({ checked }) =>
                                      classNames(
                                        planIdx === 0
                                          ? "rounded-tl-md rounded-tr-md"
                                          : "",
                                        planIdx === plans.length - 1
                                          ? "rounded-bl-md rounded-br-md"
                                          : "",
                                        checked
                                          ? "bg-orange-50 border-orange-200 z-10"
                                          : "border-gray-200",
                                        "relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3 focus:outline-none"
                                      )
                                    }
                                  >
                                    {({ active, checked }) => (
                                      <>
                                        <div className="flex items-center text-sm">
                                          <span
                                            className={classNames(
                                              checked
                                                ? "bg-orange-500 border-transparent"
                                                : "bg-white border-gray-300",
                                              active
                                                ? "ring-2 ring-offset-2 ring-gray-900"
                                                : "",
                                              "h-4 w-4 rounded-full border flex items-center justify-center"
                                            )}
                                            aria-hidden="true"
                                          >
                                            <span className="rounded-full bg-white w-1.5 h-1.5" />
                                          </span>
                                          <RadioGroup.Label
                                            as="span"
                                            className="ml-3 font-medium text-gray-900"
                                          >
                                            {plan.name}
                                          </RadioGroup.Label>
                                        </div>
                                        <RadioGroup.Description className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center">
                                          <span
                                            className={classNames(
                                              checked
                                                ? "text-orange-900"
                                                : "text-gray-900",
                                              "font-medium"
                                            )}
                                          >
                                            ${plan.priceMonthly} / mo
                                          </span>{" "}
                                          <span
                                            className={
                                              checked
                                                ? "text-orange-700"
                                                : "text-gray-500"
                                            }
                                          >
                                            (${plan.priceYearly} / yr)
                                          </span>
                                        </RadioGroup.Description>
                                        <RadioGroup.Description
                                          className={classNames(
                                            checked
                                              ? "text-orange-700"
                                              : "text-gray-500",
                                            "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right"
                                          )}
                                        >
                                          {plan.limit}
                                        </RadioGroup.Description>
                                      </>
                                    )}
                                  </RadioGroup.Option>
                                ))}
                              </div>
                            </RadioGroup>

                            <Switch.Group
                              as="div"
                              className="flex items-center"
                            >
                              <Switch
                                checked={annualBillingEnabled}
                                onChange={setAnnualBillingEnabled}
                                className={classNames(
                                  annualBillingEnabled
                                    ? "bg-orange-500"
                                    : "bg-gray-200",
                                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors ease-in-out duration-200"
                                )}
                              >
                                <span
                                  aria-hidden="true"
                                  className={classNames(
                                    annualBillingEnabled
                                      ? "translate-x-5"
                                      : "translate-x-0",
                                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                  )}
                                />
                              </Switch>
                              <Switch.Label as="span" className="ml-3">
                                <span className="text-sm font-medium text-gray-900">
                                  Annual billing{" "}
                                </span>
                                <span className="text-sm text-gray-500">
                                  (Save 10%)
                                </span>
                              </Switch.Label>
                            </Switch.Group>
                          </div>
                          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <button
                              type="submit"
                              className="bg-gray-800 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </form>
                    </section> */}

                    {/* Billing history */}
                    {/* <section aria-labelledby="billing-history-heading">
                      <div className="bg-white pt-6 shadow sm:rounded-md sm:overflow-hidden">
                        <div className="px-4 sm:px-6">
                          <h2
                            id="billing-history-heading"
                            className="text-lg leading-6 font-medium text-gray-900"
                          >
                            Billing history
                          </h2>
                        </div>
                        <div className="mt-6 flex flex-col">
                          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                              <div className="overflow-hidden border-t border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Description
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Amount
                                      </th>
                                      
                                      <th
                                        scope="col"
                                        className="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        <span className="sr-only">
                                          View receipt
                                        </span>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {payments.map((payment) => (
                                      <tr key={payment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                          <time dateTime={payment.datetime}>
                                            {payment.date}
                                          </time>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {payment.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {payment.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                          <a
                                            href={payment.href}
                                            className="text-orange-600 hover:text-orange-900"
                                          >
                                            View receipt
                                          </a>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section> */}
                  </div>
                </div>
              </main>
            </div>
          </>
        </div>
      </div>
    </MainModalEntity>
  );
}

export default CustomProtocolTemplate;

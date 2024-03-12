/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, XIcon } from "@heroicons/react/outline";
import axios from "axios";
import URL from "./../../Data/data.json";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import CompleteLoader from "../../Components/Loaders/CompleteLoader";
import MainLoader from "../../Components/Loaders/MainLoader";
import SecondInsideLoader from "../../Components/Loader/SecondInsideLoader";
import SecondLoaderWithText from "../../Components/Loaders/SecondLoaderWithText";
import { logout } from "../../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function DeactivateModal({ open, setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otp, setOTP] = useState();
  const [inOtp, setInOtp] = useState();
  const [loader, setLoader] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const sendOTP = async () => {
    setLoader(true);
    const otp = await Math.floor(100000 + Math.random() * 900000);
    var data = JSON.stringify({
      id: userInfo._id,
      otp: otp,
      email: userInfo.email,
    });

    var config = {
      method: "post",
      url: `${URL[0]}api/users/deactivate`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function(response) {
        console.log(JSON.stringify(response.data));
        toast.success("OTP sent successfully.");
        setOTP(otp);
        setLoader(false);
      })
      .catch(function(error) {
        toast.error(error.message);
        setLoader(false);
      });
  };

  const deactiveBtn = async () => {
    setLoader(true);
    if (Number(inOtp) === otp) {
      window.setTimeout(() => {
        var data = JSON.stringify({
          id: userInfo._id,
        });

        var config = {
          method: "put",
          url: `${URL[0]}api/users/deactivate`,
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios(config)
          .then(function(response) {
            toast.success(
              "Account deactivated successfully. Loging you out..."
            );
            window.setTimeout(() => {
              setLoader(false);
              dispatch(logout());
              navigate("/login");
            }, 2000);
          })
          .catch(function(error) {
            toast.error(error.message);
            setLoader(false);
          });
      }, 3000);
    } else {
      window.setTimeout(() => {
        setLoader(false);
        toast.error("Invalid OTP");
      }, 3000);
    }
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex font-dmsans items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            {loader ? (
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <CompleteLoader />
              </div>
            ) : (
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Deactivate account
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to deactivate your account? All of
                        your data will be saved in our servers but you will not
                        be able to login with the same account untill recovered.
                      </p>
                    </div>
                    {otp && (
                      <div className="mt-5 mb-8">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          We have sent an OTP to your email address
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="otp"
                            value={inOtp}
                            id="otp"
                            onChange={(e) => {
                              setInOtp(e.target.value);
                            }}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Enter the 6 digit OTP"
                          />
                        </div>
                        {/* <p
                          className="mt-2 text-sm text-gray-500"
                          id="email-description"
                        >
                          Please enter the OTP sent to your email.
                        </p> */}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  {otp ? (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        deactiveBtn();
                      }}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        sendOTP();
                      }}
                    >
                      Generate OTP
                    </button>
                  )}

                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default DeactivateModal;

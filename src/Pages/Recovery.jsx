import {
  AlertCircle,
  Check,
  CheckCircle,
  CheckCircle2,
  CheckCircleIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/actions/userActions";
import MainLoader from "../Components/Loaders/MainLoader";
import CompleteLoader from "../Components/Loaders/CompleteLoader";
import InsideLoader from "../Components/Loader/InsideLoader";
import SecondInsideLoader from "../Components/Loader/SecondInsideLoader";
import SpinnerLoader from "../Components/Loaders/SpinnerLoader";
import MainLoaderWithText from "../Components/Loaders/MainLoaderWithText";
import axios from "axios";
import URL from "./../Data/data.json";
import { toast } from "sonner";
import MainToast from "../Components/Toast/MainToast";

function Recovery() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otp, setOTP] = useState();
  const [inOtp, setInOtp] = useState();
  const [loader, setLoader] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [userInfo, setUser] = useState(
    localStorage.getItem("userStellrRecover") &&
      JSON.parse(localStorage.getItem("userStellrRecover"))
  );
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
      url: `${URL[0]}api/users/activate`,
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

  const activeBtn = async () => {
    setLoader(true);
    if (Number(inOtp) === otp) {
      window.setTimeout(() => {
        var data = JSON.stringify({
          id: userInfo._id,
        });

        var config = {
          method: "put",
          url: `${URL[0]}api/users/activate`,
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios(config)
          .then(function(response) {
            toast.success("Account activated successfully");
            window.setTimeout(() => {
              setLoader(false);
              localStorage.removeItem("userStellrRecover");
              dispatch(logout());
              setRecovered(true);
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
    <>
      <MainToast />
      <div className="h-[100vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-indigo-600">
        {loader ? (
          <div className="loader-div-main-stellr" contentEditable="false">
            <div className="flex items-center space-x-2 font-dmsans">
              <div aria-label="Loading..." role="status">
                <svg
                  className="animate-spin w-5 h-5 stroke-white"
                  viewBox="0 0 256 256"
                >
                  <line
                    x1={128}
                    y1={32}
                    x2={128}
                    y2={64}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={24}
                  ></line>
                  <line
                    x1="195.9"
                    y1="60.1"
                    x2="173.3"
                    y2="82.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={24}
                  ></line>
                  <line
                    x1={224}
                    y1={128}
                    x2={192}
                    y2={128}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={24}
                  ></line>
                  <line
                    x1="195.9"
                    y1="195.9"
                    x2="173.3"
                    y2="173.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={24}
                  ></line>
                  <line
                    x1={128}
                    y1={224}
                    x2={128}
                    y2={192}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={24}
                  ></line>
                  <line
                    x1="60.1"
                    y1="195.9"
                    x2="82.7"
                    y2="173.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={24}
                  ></line>
                  <line
                    x1={32}
                    y1={128}
                    x2={64}
                    y2={128}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={24}
                  ></line>
                  <line
                    x1="60.1"
                    y1="60.1"
                    x2="82.7"
                    y2="82.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={24}
                  ></line>
                </svg>
              </div>

              <span className="text-base font-medium text-white">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          <>
            {recovered ? (
              <>
                <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
                  <CheckCircle2 className="mx-auto h-12 w-auto text-white" />
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-white font-body">
                    Account Recovered
                  </h2>

                  <p className="mt-2 text-center text-xl font-dmsans text-gray-100">
                    You can now login to your account. Click here to{" "}
                    <a
                      href=""
                      className="text-purple-200 underline"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/login");
                      }}
                    >
                      {" "}
                      login
                    </a>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
                  <AlertCircle className="mx-auto h-12 w-auto text-white" />
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-white font-body">
                    Welcome back, {userInfo && userInfo.name && userInfo.name}.
                  </h2>

                  <p className="mt-2 text-center text-xl font-dmsans text-gray-100">
                    Your account has been deactivated. To re-activate your
                    account, please use the following form.
                  </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md font-dmsans">
                  <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" action="#" method="POST">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email address
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            value={userInfo && userInfo.email && userInfo.email}
                            disabled={true}
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="mt-2"></div>
                          <a
                            href="#"
                            onClick={async (e) => {
                              e.preventDefault();
                              setLoader(true);
                              localStorage.removeItem("userStellrRecover");
                              dispatch(logout());
                              window.setTimeout(() => {
                                setLoader(false);
                                navigate("/login");
                              }, 3000);
                            }}
                            className="text-indigo-600 text-sm"
                          >
                            change account
                          </a>
                        </div>
                      </div>
                      {otp && (
                        <div>
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            One Time Password
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
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        {otp ? (
                          <button
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              activeBtn();
                            }}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Recover
                          </button>
                        ) : (
                          <button
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              sendOTP();
                            }}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Generate OTP
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Recovery;

import React, { useRef, useState } from "react";
import BasicModalTailwind from "../../UI/MainModals/BasicModalTailwind";
import MainLoaderWithText from "../Loaders/MainLoaderWithText";
import SpinnerLoader from "../Loaders/SpinnerLoader";
import SignaturePad from "react-signature-canvas";
import DefaultButton from "../../UI/Button/DefaultButton";
import URL from "./../../Data/data.json";
import { useSelector } from "react-redux";
import { addEntryLogs } from "../Functions/addEntryLogs";
import { removeFromCart } from "../../redux/actions/cartActions";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import axios from "axios";

function SubmitForApproval({ open, setOpen, tab, setEntryUpdate, setWhichTabisActive }) {
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false);
  const sigPad = useRef(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const submitEntry = async (e) => {
    e.preventDefault()
    const signature = await sigPad.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    let authorData = {
      name: userInfo.name,
      date: new Date(),
      sign: signature,
    }
    var data = JSON.stringify({
      submittedForApproval: true,
    });
    var config = {
                        method: "put",
                        url: `${URL[0]}api/entries/${tab._id}`,
                        headers: {
                          Authorization: `Bearer ${userInfo.token}`,
                          "Content-Type": "application/json",
                        },
                        data: data,
                      };

                      axios(config)
                        .then(async function(response) {
                          setLoader(false);
                          const logObject = {
                            entryId: tab._id,
                            user: userInfo._id,
                            userName: userInfo.name,
                            userEmail: userInfo.email,
                            message: `The entry was submitted for approval by ${userInfo.name}`,
                            anyData: JSON.stringify(authorData)
                          };
                          await addEntryLogs(logObject);
                          setEntryUpdate(true);
                          setWhichTabisActive("projectList");
                          setOpen(false);
                          await dispatch(removeFromCart(tab._id));
                          toast.success("Updated");
                        })
                        .catch(function(error) {
                          setLoader(false);
                          console.log(error);
                        });
  }

  return (
    <BasicModalTailwind open={open} setOpen={setOpen}>
      {loader && <SpinnerLoader text="Updating" />}
      <h1 className="text-xl mb-5 font-dmsans">Submitting for approval</h1>
      <form action="#">
      <div className="w-full font-dmsans">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Signature
                  </label>
                  <SignaturePad
                    canvasProps={{
                      width: 250,
                      height: 100,
                      className: "bg-gray-50 rounded-lg border border-gray-300",
                      //,
                    }}
                    ref={sigPad}
                  />
                </div>
                <span className="relative z-0 inline-flex shadow-sm rounded-md mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      sigPad.current.clear();
                    }}
                    className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    Clear canvas
                  </button>
                </span>
                <div className="block my-5">
      <button
        type="submit"
        onClick={(e) => {
          submitEntry(e)
        }}
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit
      </button>
    </div>

      </form>
    </BasicModalTailwind>
  );
}

export default SubmitForApproval;

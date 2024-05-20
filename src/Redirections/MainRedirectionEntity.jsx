import React, { useState, useEffect } from "react";
import SecondLoaderWithText from "../Components/Loaders/SecondLoaderWithText";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import { XCircleIcon } from "@heroicons/react/solid";
import { useSelector } from "react-redux";
import axios from "axios";
import URL from "./../Data/data.json";
import { PlusIcon, UserX } from "lucide-react";
import { addTime } from "../Components/Functions/addTime";
import {
  listMyCollabOrgs,
  listMyOrgs,
} from "../redux/actions/organizationActions";
import { getUserDetails } from "../redux/actions/userActions";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addToState } from "../redux/actions/stateActions";
import { addToCart } from "../redux/actions/cartActions";

function MainRedirectionEntity({
  setWhichTabisActive,
  setProtocolContent,
  setProtocolModal,
  setSopModal,
  setSopContent,
  setTabId,
  setTaskContent,
  setTaskModal,
  setSampleContent,
  setSampleModal,
  setCDModalContent,
  setCDModal,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(true);
  const [ownerUserData, setOwnerUserData] = useState();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orgListMy = useSelector((state) => state.orgListMy);
  const { loading: loading, error: errorOrg, sucess: sucess, orgs } = orgListMy;

  const orgListMyCollab = useSelector((state) => state.orgListMyCollab);
  const { sucess: sucessCollab, orgs: orgsCollab } = orgListMyCollab;

  useEffect(() => {
    dispatch(listMyOrgs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUserDetails("profile"));
  }, [dispatch]);
  useEffect(() => {
    dispatch(listMyCollabOrgs());
  }, [dispatch]);

  const findOrg =
    orgs && orgs.length > 0
      ? orgs[0]
      : orgsCollab && orgsCollab.length > 0
      ? orgsCollab[0]
      : null;

  const findOrgRole =
    orgs && orgs.length > 0
      ? orgs[0].user == userInfo._id && "Owner"
      : orgsCollab && orgsCollab.length > 0
      ? orgsCollab[0].collaborators.find((e) => e.user == userInfo._id) &&
        orgsCollab[0].collaborators.find((e) => e.user == userInfo._id)
          .permissions
      : null;

  const showEntity = async (type, data) => {
    switch (type) {
      case "protocols":
        setProtocolContent(data);
        setProtocolModal(true);
        break;
      case "sops":
        setSopContent(data);
        setSopModal(true);
        break;
      case "tasks":
        setTaskContent(data);
        setTaskModal(true);
        break;
      case "samples":
        setSampleContent(data);
        setSampleModal(true);
        break;
      case "entries":
        {
          if (data.type === "Lab Sheet") {
          } else {
            await dispatch(addToState(`tabs#${data._id}`));
            await dispatch(
              addToCart({
                doc: data,
                project: data.project,
                userType: data.access === "view" ? "Read" : "Admin",
              })
            );
            setTabId(data._id);
            setWhichTabisActive("tabs");
          }
        }
        break;
      case "reports":
        setProtocolContent(data);
        setProtocolModal(true);
        break;
      case "cd":
        setCDModalContent(data);
        setCDModal(true);
        break;
      case "projects":
        break;
    }
  };

  const getDetails = async (type, id, role) => {
    var config = {
      method: "get",
      url: `${URL[0]}api/${type}/share/${id}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };
    axios(config)
      .then(async function(response) {
        navigate("/");
        setLoader(false);
        response.data.access = role;
        showEntity(type, response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const ownerUser = async () => {
    var config = {
      method: "get",
      url: `${URL}api/users/${findOrg.user}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(async function(response) {
        if (response) {
          setOwnerUserData(response.data);
        } else {
          toast.error("No user found for that email.");
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (findOrg) {
      if (!ownerUserData) {
        ownerUser();
      }
    }
  }, [ownerUserData, findOrg]);

  useEffect(() => {
    if (!userInfo) {
      navigate(`/login?redirect=p/${id}`);
    } else {
      if (findOrg) {
        const ciphertext = id.toString().replaceAll("Por21Ld", "/");
        var bytes = CryptoJS.AES.decrypt(ciphertext, "3VJx8BtRnD");
        if (bytes) {
          try {
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            var config = {
              method: "get",
              url: `${URL[0]}api/link/share/${decryptedData.id}`,
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
                "Content-Type": "application/json",
              },
            };
            axios(config)
              .then(async function(response) {
                const mainData = JSON.parse(response.data.data);
                if (addTime(mainData.expiry) >= addTime(Date.now())) {
                  if (findOrg._id === mainData.org) {
                    getDetails(mainData.type, mainData.id, mainData.role);
                  } else {
                    setLoader(false);
                    setError(true);
                    setErrorMessage(
                      "Uh-oh! It seems you don't have the necessary permissions to access this content. Please ensure you're logged in with the appropriate credentials or contact the administrator for assistance."
                    );
                  }
                } else {
                  setLoader(false);
                  setError(true);
                  setErrorMessage(
                    "Oops! It seems the link you're trying to access has expired. Links often have a limited lifespan for security reasons. Please request a fresh link or contact the administrator for further assistance."
                  );
                }
              })
              .catch(function(error) {
                console.log(error);
                setError(true);
                setErrorMessage(
                  "Oops! It seems the link you're trying to access has expired. Links often have a limited lifespan for security reasons. Please request a fresh link or contact the administrator for further assistance."
                );
              });
          } catch {
            setLoader(false);
            setError(true);
            setErrorMessage(
              "We're sorry, but the link you've attempted to access is not valid. Please ensure you've entered the correct URL or try contacting the administrator for assistance."
            );
          }
        } else {
          setLoader(false);
          setError(true);
          setErrorMessage(
            "We're sorry, but the link you've attempted to access is not valid. Please ensure you've entered the correct URL or try contacting the administrator for assistance."
          );
        }
      }
    }
  }, [findOrg]);

  return (
    <div className="main-red">
      <div className="inside-main-red">
        {loader && <SecondLoaderWithText />}
        {error ? (
          <div className="w-[100%] h-[100%] flex items-center justify-center">
            <div className="text-center font-dmsans bg-white shadow-xl px-10 py-5 rounded-md">
              <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-md font-medium text-gray-900 max-w-md">
                {errorMessage}
              </h3>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={(e) => {
                    navigate("/");
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continue to dashboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default MainRedirectionEntity;

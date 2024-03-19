import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import URL from "./../../../Data/data.json";
import { addOrgLogs } from "../../Functions/addOrgLogs";
function JoinOrgModal({
  setCreateOrg,
  setNewOrg,
  setWhichTabisActive,
  setShowBannerOrg,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [inviteCode, setInviteCode] = useState();
  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      orgId: inviteCode.split("-")[1],
      collabDetails: {
        user: userInfo._id,
        userName: userInfo.name,
        userEmail: userInfo.email,
      },
    };
    var config = {
      method: "post",
      url: `${URL}api/organs/join`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function(responseData) {
        setCreateOrg(false);
        setNewOrg(true);
        setShowBannerOrg(false);
        setWhichTabisActive("orgList");
        const logObject = {
          entryId: inviteCode.split("-")[1],
          user: userInfo._id,
          userName: userInfo.name,
          userEmail: userInfo.email,
          message: `Joined the organization using an invite code.`,
        };
        await addOrgLogs(logObject);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  return (
    <div className="forms-inside-div">
      <div className="form-inside-org">
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Enter invite code"
            onChange={(e) => setInviteCode(e.target.value)}
            required
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default JoinOrgModal;

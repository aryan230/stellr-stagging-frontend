import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import URL from "./../../Data/data.json";
import { userAvatar } from "../Functions/userAvatar";
import { addTime } from "../Functions/addTime";
import { Bell } from "lucide-react";
function ListNotifications() {
  const [data, setData] = useState();

  const userLogin = useSelector((state) => state.userLogin);
  let { loading, error, userInfo } = userLogin;

  const getNotifications = async () => {
    var config = {
      method: "get",
      url: `${URL[0]}api/notification/1`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function(response) {
        setData(response.data);
        console.log(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  useEffect(() => {
    if (userInfo) {
      if (!data) {
        getNotifications();
      }
    }
  }, [data, userInfo]);

  return (
    <div className="w-[100%] h-[100%] flex items-center justify-center">
      <div className="w-[95%] bg-white rounded-sm shadow-md h-[95%] font-dmsans">
        <div className="h-[15%] w-[80%] mx-auto flex items-center justify-left ">
          <h1 className="flex items-center justify-start text-3xl font-black font-[Gotham-Black] bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            All Notifications
          </h1>
        </div>

        <ul
          role="list"
          className="divide-y divide-gray-200 max-w-fit mx-auto overflow-y-auto h-[80%]"
        >
          {data &&
            data.length > 0 &&
            data
              .sort(function(a, b) {
                return (
                  new Date(JSON.parse(b.data).date) -
                  new Date(JSON.parse(a.data).date)
                );
              })
              .map((message) => (
                <li key={message._id} className="py-4">
                  <div className="flex space-x-3">
                    <img
                      className="h-6 w-6 rounded-full"
                      src={userAvatar(
                        JSON.parse(message.data).subject &&
                          JSON.parse(message.data)
                            .subject.toString()
                            .split("by ")[1]
                      )}
                      alt=""
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">
                          {" "}
                          {JSON.parse(message.data).subject &&
                            JSON.parse(message.data)
                              .subject.toString()
                              .split("by ")[1]}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {addTime(JSON.parse(message.data).date)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {JSON.parse(message.data).subject}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
}

export default ListNotifications;

import React, { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Eye, Share2 } from "lucide-react";
import ShareSidebar from "./ShareSidebar";
import AdvancedShareSettings from "../AdvancedShareSettings/AdvancedShareSettings";

function ShareMain({
  styles,
  type,
  id,
  share,
  setUpdate,
  events,
  customCollabs,
  access,
}) {
  const [menu, setMenu] = useState(false);
  const [shareData, setShareData] = useState(share);

  return (
    <div className={styles}>
      {/* {<AdvancedShareSettings open={advShare} setOpen={setAdvShare} />} */}
      <ShareSidebar
        open={menu}
        setOpen={setMenu}
        type={type}
        id={id}
        share={shareData}
        setUpdate={setUpdate}
        setShareData={setShareData}
        events={events}
        customCollabs={customCollabs}
      />
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            onClick={(e) => {
              e.preventDefault();
              setMenu(true);
            }}
            className="inline-flex justify-center w-full rounded-full p-3 border border-gray-300 shadow-sm bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          >
            <Share2 size={18} />
          </Menu.Button>
        </div>
      </Menu>
    </div>
  );
}

export default ShareMain;

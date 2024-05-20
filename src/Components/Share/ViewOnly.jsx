import { Menu } from "@headlessui/react";
import { Eye } from "lucide-react";
import React from "react";

function ViewOnly() {
  return (
    <div className="absolute bottom-10 right-10 z-[9999999]">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex items-center justify-center w-full rounded-full p-3 border border-gray-300 shadow-sm bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
            <Eye size={16} className="mr-2" />
            View Only
          </Menu.Button>
        </div>
      </Menu>
    </div>
  );
}

export default ViewOnly;

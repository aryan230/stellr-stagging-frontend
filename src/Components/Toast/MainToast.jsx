import React from "react";
import { Toaster, toast } from "sonner";

function MainToast() {
  return (
    <Toaster
      expand={true}
      position="bottom-right"
      richColors
      toastOptions={{
        style: {},
        className: "font-dmsans",
      }}
    />
  );
}

export default MainToast;

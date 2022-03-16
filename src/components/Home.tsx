import { initializeIcons } from "@fluentui/react";
import React from "react";
import { ToastProvider } from "react-toast-notifications";

import MusicView from "./MusicView";

// See https://github.com/microsoft/fluentui/wiki/Using-icons
initializeIcons(/* optional base url */);

export default function Home(): React.ReactElement {
  return (
    <ToastProvider>
      <MusicView />
    </ToastProvider>
  );
}

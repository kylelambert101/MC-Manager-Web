import { initializeIcons } from "@fluentui/react";
import React from "react";
import { ToastProvider } from "react-toast-notifications";

import MusicView from "../features/music/MusicView";

// See https://github.com/microsoft/fluentui/wiki/Using-icons
initializeIcons(/* optional base url */);

export default function Home(): JSX.Element {
  return (
    <ToastProvider>
      <MusicView />
    </ToastProvider>
  );
}

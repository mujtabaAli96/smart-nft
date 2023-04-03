import React from "react";
import { createRoot } from "react-dom/client";
import MainErrorCapturer from "../../common/component/error-comp/main-error";
import CreateCollection from "./component/create-collection/create-collection";

const App = () => {
  return (
    <MainErrorCapturer>
      <CreateCollection redirectToSinglePage={true} />
    </MainErrorCapturer>
  );
};

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);
if (container) {
  appRoot.render(<App redirectToSinglePage={true} />);
}

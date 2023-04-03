console.log("profile page");
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import useWeb3provider from "../../common/hook/wallet.hook";
import { Header } from "./component/edit-profile/header";
import { Form } from "./component/edit-profile/form";
import { ImageUploader } from "./component/edit-profile/uplod-img";
import { useProfileEdit } from "./hooks/useProfileEdit";
import MainErrorCapturer from "../../common/component/error-comp/main-error";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const web3Provider = useWeb3provider();
  const editeProfileProvider = useProfileEdit(web3Provider.account[0]);

  return (
    <div id="app">
      <MainErrorCapturer>
        <div className="edit-profile smart-nft-profile">
          <Header
            web3Provider={web3Provider}
            editeProfileProvider={editeProfileProvider}
            isLoading={isLoading}
          />
          <div className="profile-column-two">
            <Form
              web3Provider={web3Provider}
              editeProfileProvider={editeProfileProvider}
            />
            <ImageUploader
              web3Provider={web3Provider}
              editeProfileProvider={editeProfileProvider}
            />
          </div>
        </div>
      </MainErrorCapturer>
    </div>
  );
};

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);

if (container) {
  appRoot.render(<App />);
}

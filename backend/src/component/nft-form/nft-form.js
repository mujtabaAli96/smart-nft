import React from "react";
import { FormHeader } from "./form-header";
import { Wallet } from "./form-wallet";
import { ImageUploadForm } from "./image-upload-form";

const CreateNftForm = () => {
  return (
    <div className="create-nft-form">
      <FormHeader />
      <Wallet />
      <ImageUploadForm />
    </div>
  );
};

export { CreateNftForm };

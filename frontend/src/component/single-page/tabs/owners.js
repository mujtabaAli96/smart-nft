import React from "react";
import { Erc721Owners } from "../owners/erc721-owners";
import { Erc1155Owners } from "../owners/erc1155-owners";

export const Owners = ({ data }) => {
  if (data.loading) return null;

  const { standard } = data.nftInfo;

  return (
    <div className="owners-tab">
      {standard === "Erc721" && (
        <Erc721Owners accountHash={data.nftInfo.owners[0]} />
      )}
      {standard === "Erc1155" && <Erc1155Owners data={data} />}
    </div>
  );
};

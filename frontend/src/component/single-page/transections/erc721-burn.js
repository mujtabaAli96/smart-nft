import useContractGenaretor from "../../../../../common/hook/contract-genaretor.hook";
import useNft from "../../../../../common/hook/useNft.hook";
import { catchWalletError } from "./error";

export const erc_721_burn_token = async (nftInfo, web3Provider) => {
  //CATCH WALLET ERROR;
  await catchWalletError(nftInfo, web3Provider);

  const { contractAddress } = nftInfo;
  const erc721Token = useContractGenaretor(
    contractAddress,
    "Erc721",
    web3Provider.wallet
  );
  const { deleteLocalNft } = useNft();

  //IF ITS A FREE MINTING NFT THEN DONT NEED ANY NETWORK TRANSECTION
  //////////////////////////////////////////////////////////////
  if (nftInfo.isFreeMinting != "true") {
    //MAKE THE TRANSECTION TO BURN TOKEN;
    const tx = await erc721Token.burn(parseInt(nftInfo.tokenId));
    await tx.wait();
  }

  //DELETE THE NFT FROM LOCAL DB;
  await deleteLocalNft(nftInfo.postId);
};

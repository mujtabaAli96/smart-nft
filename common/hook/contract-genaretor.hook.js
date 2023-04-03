import { providers, Contract } from "ethers/lib/ethers";
import ERC721ABI from "../../contracts/Erc721";
import ERC20ABI from "../../contracts/Erc20";
import ERC1155ABI from "../../contracts/Erc1155";
import MARKETABI from "../../contracts/ImplementationV2";
import PROXYABI from "../../contracts/Proxy";
import AUCTIONABI from "../../contracts/Auction";

const useContractGenaretor = (contractAddress, standard, wallet) => {
  const provider = new providers.Web3Provider(wallet);
  const signer = provider.getSigner();
  let ABI;

  if (standard == "Erc721") ABI = ERC721ABI.abi;
  if (standard == "Erc20") ABI = ERC20ABI.abi;
  if (standard == "Erc1155") ABI = ERC1155ABI.abi;
  if (standard == "Market") ABI = MARKETABI.abi;
  if (standard == "Proxy") ABI = PROXYABI.abi;
  if (standard == "Auction") ABI = AUCTIONABI.abi;

  return new Contract(contractAddress, ABI, signer);
};

export default useContractGenaretor;

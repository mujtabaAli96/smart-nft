import { Contract } from "ethers/lib/ethers";
import { ESCROW_CONTRACT } from "../store";

const SmartnftImporterEscrowContractAbi = [
  "function transfer_token(address _contract, uint256 _token_id) public payable",
  "function put_on_sale(address _contract, uint256 _token_id, uint256 price) public",
  "function remove_form_sale(address _contract, uint256 _token_id) public",
];

export const escrowContract = ({ signer }) =>
  new Contract(
    ESCROW_CONTRACT.address,
    SmartnftImporterEscrowContractAbi,
    signer
  );

export const magicContract = (contractAddress, signer) => {
  const ABI = [
    "function approve(address to, uint256 tokenId) public",
    "function setApprovalForAll(address operator, bool approved) public",
    "function isApprovedForAll(address owner, address operator) public view returns (bool)",
    "function getApproved(uint256 tokenId) public view returns (address)",
    "function ownerOf(uint256 tokenId) view external returns (address)",
  ];

  return new Contract(contractAddress, ABI, signer);
};

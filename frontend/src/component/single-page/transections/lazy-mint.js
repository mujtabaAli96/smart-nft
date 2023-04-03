import useNft from "../../../../../common/hook/useNft.hook";

export const lazy_mint_buy = async ({
  proxyContract,
  standardContract,
  web3Provider,
  parseEther,
  nftInfo,
  price,
  standard,
}) => {
  const { updateNftMetaByPostId } = useNft();

  let id,
    tx,
    splitPaymenstAddress = [],
    splitPaymentPercentages = [],
    royalty = parseInt(nftInfo.royalty) || 0,
    hasRoyalty = nftInfo?.royalty != "0",
    hasSplitPayment = nftInfo?.hasSplitPayment == "true",
    erc20Con = "0x0000000000000000000000000000000000000000",
    _standard = 0,
    isCustomCoin = false;

  if (standard == "Erc1155") {
    id = (await standardContract.tokenCounts()).toNumber() + 1;
    _standard = 1155;
  }
  if (standard == "Erc721") {
    id = (await standardContract.tokenIds()).toNumber() + 1;
    _standard = 721;
  }
  if (nftInfo?.customCoin?.isCustomCoin == "true") {
    erc20Con = nftInfo?.customCoin?.contract?.address;
    isCustomCoin = true;
  }

  if (!id) throw new Error("No Id is Provided!");
  if (_standard == 0) throw new Error("Invalid standard");

  if (hasSplitPayment) {
    nftInfo?.splitPayments?.forEach((cur, i) => {
      splitPaymenstAddress[i] = cur.address;
      splitPaymentPercentages[i] = parseInt(cur.percentage) * 100;
    });

    const _total = splitPaymentPercentages.reduce(
      (defaultVal, curVal) => defaultVal + curVal,
      0
    );

    if (_total != 10000) throw new Error("Invalid split payment");
  }

  //contract_address, token_creator, erc20Con, _split_payment_accounts_from_index_3
  //chain_id, price_of_one_copy, royalty_percentage, token_id, amount, standard, buy_amount, _split_payment_percentages_from_index_7
  //is_erc_1155, has_split_payment, has_royalty, is_erc_20
  //string memory tokenUri
  tx = await proxyContract.lazy_mint(
    [
      nftInfo.contractAddress,
      nftInfo.creator,
      erc20Con,
      ...splitPaymenstAddress,
    ],
    [
      web3Provider.network.chainId,
      parseEther(price),
      royalty,
      id,
      parseInt(nftInfo.amount),
      _standard,
      1,
      ...splitPaymentPercentages,
    ],
    [_standard == 1155, hasSplitPayment, hasRoyalty, isCustomCoin],
    nftInfo.jsonUrl,
    {
      value: parseEther(price),
    }
  );

  await tx.wait();

  //AFTER BUY ITS NOT A FREE MINTING NFT ANY MORE SO UPDATE
  await updateNftMetaByPostId(nftInfo.postId, {
    newMeta: { isFreeMinting: false, tokenId: id },
    //newDirectMeta will get their owne key on meta field
    newDirectMeta: { tokenId: id },
  });

  return tx;
};

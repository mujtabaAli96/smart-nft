import { useState, useEffect } from "react";
import useWeb3provider from "../../../common/hook/wallet.hook";
import useNft from "../../../common/hook/useNft.hook";
import useTxHash from "../../../common/hook/useTxhash.hook";
import useCollection from "../../../common/hook/useCollection.hook";
import useCategories from "../../../common/hook/useCategories.hook";
import useErc1155Owners from "../../../common/hook/useErc1155Owners";

const useNftInfo = (id) => {
  const web3Provider = useWeb3provider();
  const [nftMeta, setNftMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const { getNftByPostId } = useNft();
  const { getTxHashLocally } = useTxHash();
  const { getCollectionByPostId } = useCollection();
  const { getCategoryByPostId } = useCategories();
  const { getErc1155Owners } = useErc1155Owners();

  useEffect(() => {
    async function fetchData() {
      const result = {};
      const nft = getNftByPostId(id).then((res) => {
        result.nftInfo = { ...res.data, postId: id };
      });

      const nftTxHash = getTxHashLocally(id).then((res) => {
        result.nftTxHash = res.data;
      });

      const nftCollection = getCollectionByPostId(id).then((res) => {
        result.nftCollection = res.data;
      });

      const nftCategory = getCategoryByPostId(id).then((res) => {
        result.nftCategory = res;
      });

      const nftOwners = getErc1155Owners(id).then((res) => {
        result.nftOwners = res;
      });

      await Promise.all([
        nft,
        nftTxHash,
        nftCollection,
        nftCategory,
        nftOwners,
      ]);

      setNftMeta({ ...result });
      setLoading(false);
    }

    fetchData();
  }, [web3Provider]);

  return {
    //nftId: id,
    ...nftMeta,
    web3Provider,
    loading,
  };
};

export { useNftInfo };

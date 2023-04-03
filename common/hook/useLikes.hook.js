import { useState, useEffect } from "react";
import useWeb3provider from "./wallet.hook";
import { BACKEND_AJAX_URL, SLUG } from "../store";
import { errorMessage } from "../component/message/error";
const { __ } = wp.i18n;

const getNftlikes = async (tokenId) => {
  if (!tokenId) {
    errorMessage(__("Please provide tokenId", SLUG));
    throw new Error("Please provide tokenId");
  }

  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        like_info: {
          tokenId,
        },
        action: "get_likes",
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

const storeNftlikes = async (tokenId, address) => {
  if (!tokenId || !address) {
    errorMessage(__("Please connect wallet for your action.", SLUG));
    throw new Error("Please connect wallet for your action.");
  }

  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        like_info: {
          tokenId,
          wallet_address: address,
        },
        action: "store_likes",
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

const removeNftlikes = async (tokenId, address) => {
  if (!tokenId || !address) {
    throw new Error("Please connect wallet for your action.");
  }

  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        like_info: {
          tokenId,
          wallet_address: address,
        },
        action: "remove_likes",
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

const useNftLike = (tokenId) => {
  const { account, loading } = useWeb3provider();
  const [likes, setLikes] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (loading) return;
        const res = await getNftlikes(tokenId);
        // console.log( res.data )
        if (res.data) {
          setLikes(res.data);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [loading, account]);

  return {
    likes,
    setLikes,
    removeNftlikes,
    storeNftlikes,
    account: account[0],
    isLoading,
  };
};

export default useNftLike;

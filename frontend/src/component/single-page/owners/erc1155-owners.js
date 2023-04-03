import React, { useState, useEffect } from "react";
import { Profile } from "./profile-markup";
import { erc_1155_normal_buy } from "../transections/erc1155-normal-buy";
import { erc_1155_custom_token_normal_buy } from "../transections/erc1155-custom-token-normal-buy";
import { BuyLoadingPopup } from "../buy-loading-popup";
import { BACKEND_AJAX_URL, SLUG } from "../../../../../common/store";
import { OwnersLoader } from "./loader";
const { __ } = wp.i18n;

export const convertObjToArray = (objs) => {
  const arr = Object.keys(objs).map((cur) => ({ ...objs[cur], address: cur }));
  return arr.sort((a, b) => parseInt(a.price) - parseInt(b.price));
};

async function feachAccount(accountHash) {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        action: "get_profile",
        account: accountHash.toLowerCase(),
      },
    });
    return res.data;
  } catch (err) {
    console.error("profileError: ", err);
  }
}

export const Erc1155Owners = ({ data }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(20);
  const [start, setStart] = useState(0);
  const { nftOwners, nftInfo } = data;
  const owners = convertObjToArray(nftOwners);

  const sliced = owners.slice(start, limit);

  useEffect(() => {
    async function feachData() {
      const req = sliced.map((cur) =>
        feachAccount(cur.address).then((res) => ({
          token: cur,
          profile: { ...res, accountHash: cur.address },
        }))
      );
      const res = await Promise.all(req);
      setProfiles([...profiles, ...res]);
      setLoading(false);
    }
    feachData();
  }, [start]);

  console.log(profiles);

  return (
    <div className="owners">
      {profiles.map((cur, i) => (
        <div className="owners__grid" key={i}>
          <div className="owners__grid__profile">
            <Profile profile={cur.profile} />
            <Amount token={cur.token} nftInfo={nftInfo} />
          </div>
          <div className="owners__grid__buy-btn">
            <BuyBtn token={cur.token} data={data} />
          </div>
        </div>
      ))}
      {loading && <OwnersLoader />}
    </div>
  );
};

const BuyBtn = ({ token, data }) => {
  const [tx, setTx] = useState(null);
  const [isLoaderOpen, setLoader] = useState(false);
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const { nftInfo, nftOwners, web3Provider } = data;

  if (
    token.isListed !== "true" ||
    web3Provider.account[0]?.toLowerCase() === token.address
  ) {
    return null;
  }

  const buy = async () => {
    console.log("buy........");
    try {
      let res;
      if (nftInfo?.customCoin?.isCustomCoin == "true") {
        res = await erc_1155_custom_token_normal_buy(
          nftInfo,
          web3Provider,
          token,
          nftOwners
        );
      } else {
        res = await erc_1155_normal_buy(
          nftInfo,
          web3Provider,
          token,
          nftOwners
        );
      }
      setTx(res);
      setLoadingComplete(true);
    } catch (err) {
      setLoader(false);
    }
  };

  return (
    <div>
      <BuyLoadingPopup
        isOpen={isLoaderOpen}
        setIsOpen={setLoader}
        data={data}
        isComplete={isLoadingComplete}
        tx={tx}
      />
      <button
        onClick={() => {
          setLoader(true);
          buy();
        }}
      >
        {__("Buy", SLUG)}
      </button>
    </div>
  );
};

const Amount = ({ token, nftInfo }) => {
  const { network } = nftInfo?.selectedContract;
  const currencySymbol =
    nftInfo?.customCoin?.isCustomCoin == "true"
      ? nftInfo?.customCoin?.contract?.symbol
      : network?.currencySymbol;

  return (
    <p className="owners__grid__profile__amount">
      {token.isListed == "true" &&
        __(
          `${token.amount} editions on sale for ${token.price} ${currencySymbol} each.`,
          SLUG
        )}
      {token.isListed !== "true" &&
        __(`${token.amount} editions not for sale.`, SLUG)}
    </p>
  );
};

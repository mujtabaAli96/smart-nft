import React, {useState, useEffect} from "react";
import { BACKEND_AJAX_URL, SLUG } from "../../../../../common/store";
import { OwnersLoader } from "../owners/loader";
import { Profile } from "../owners/profile-markup";
const {__} = wp.i18n
const formatAddress = (address) => {
  if (!address) return null;

  return (
    <b>
      {address.slice(0, 8)}...{address.slice(address.length - 4)}
    </b>
  );
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
export const History = ({ data }) => {
  const [ profiles, setProfiles ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const { nftTxHash, nftInfo } = data;
  
  const [limit, setLimit] = useState(20);
  const [start, setStart] = useState(0);
  const sliced = nftTxHash.slice(start, limit);
  useEffect(() => {
    async function feachData() {
      const req = sliced.map((cur) =>
        feachAccount(cur.signer).then((res) => ({
          tx: cur,
          profile: { ...res, accountHash: cur.signer },
        }))
      );
      const res = await Promise.all(req);
      setProfiles([...profiles, ...res]);
      setLoading(false);
    }
    feachData();
  }, [start]);

  return (
    <div className="owners">
      {
        profiles.map((cur, i) => (
          <div className="owners__grid" key={i}>
            <div className="owners__grid__profile">
                <Profile profile={cur.profile} />
                <TxProfile tx={cur.tx} nftInfo={nftInfo} />
            </div>
          </div>
        ))
        .reverse()
      }
      {
        loading && <OwnersLoader />
      }
    </div>
  );
};

const TxProfile = ({ tx, nftInfo }) => {
  const { network } = nftInfo.selectedContract;
  const currencySymbol =
    nftInfo?.customCoin?.isCustomCoin == "true"
      ? nftInfo?.customCoin?.contract?.symbol
      : network?.currencySymbol;
      
  const formatTimeFromTimeStamp = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return `${date.toLocaleString()}`;
  };
  return (
    <p className="owners__grid__profile__amount">
      <strong>
        {tx.eventType} {tx.amount ? `${tx.amount} ${__("editions", SLUG)}` : ''} 
      </strong> 
        {tx.to ? <span>{__(" to", SLUG)} {formatAddress(tx.to)}</span> : ''} 
        {__(" on", SLUG)} {formatTimeFromTimeStamp(tx.time)} 
        {tx.price ? <span>{__(" for", SLUG)} <strong>{tx.price} {currencySymbol}</strong></span> : ''}
    </p>
  );
}

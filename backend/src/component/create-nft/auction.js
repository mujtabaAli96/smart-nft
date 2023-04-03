import React, { useContext } from "react";
import { CreateNftContext } from "./state";
import { errorMessage } from "../../../../common/component/message/error";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

const AuctionMinPrice = () => {
  const { state, dispatch } = useContext(CreateNftContext);

  if (!state.auction.isAuctionSet) return null;

  const onChange = (e) => {
    const value = e.target.value;
    const valueToFloat = parseFloat(value);

    if (isNaN(valueToFloat)) {
      errorMessage(__("Invalid min price", SLUG));
      dispatch({ type: "CHANGE_AUCTION_MIN_PRICE", payload: 0 });
      throw new Error("Invalid min price");
    }

    dispatch({ type: "CHANGE_AUCTION_MIN_PRICE", payload: valueToFloat });
    dispatch({ type: "CHANGE_PRICE", payload: valueToFloat });
  };

  console.log(state);

  return (
    <div>
      <label htmlFor="auction__min_price">
        <p>{__("Min Price", SLUG)}</p>
        <input
          type="text"
          id="auction__min_price"
          placeholder={__("Min Price", SLUG)}
          onChange={onChange}
        />
        <span>{state.selectedContract?.network?.currencySymbol}</span>
      </label>
    </div>
  );
};

const AuctionOpenClose = () => {
  const { state, dispatch } = useContext(CreateNftContext);

  const onAuctionStatusChange = (e) => {
    const isChecked = e.target.checked;

    if (!isChecked) {
      dispatch({ type: "CHANGE_AUCTION_STATUS", payload: false });
      dispatch({ type: "CHANGE_AUCTION_MIN_PRICE", payload: 0 });
      dispatch({ type: "CHANGE_AUCTION_START_DATE", payload: 0 });
      dispatch({ type: "CHANGE_AUCTION_END_DATE", payload: 0 });
      return null;
    }
    //if auction start then make price 0
    dispatch({ type: "CHANGE_PRICE", payload: 0 });
    return dispatch({ type: "CHANGE_AUCTION_STATUS", payload: true });
  };

  return (
    <div className="auction__open-close">
      <p className="header-two">{__("Auction", SLUG)}</p>
      <label className="switch">
        <input type="checkbox" onChange={onAuctionStatusChange} />
        <span className="slider round"></span>
      </label>
      <p className="pra-one">{__("Sell this item into an Auction", SLUG)}</p>
    </div>
  );
};

const AuctionTime = () => {
  const { state, dispatch } = useContext(CreateNftContext);

  if (!state.auction.isAuctionSet) return null;

  const onDateTimeChange = (e, dispatchType) => {
    const value = e.target.value;
    dispatch({ type: dispatchType, payload: value });
  };

  let today = new Date().toISOString().split("T")[0]; //86400 * 1000 = 1 day in ms
  console.log(today);

  return (
    <div className="auction__times">
      <div>
        <p className="header-two">{__("Auction start date:")}</p>
        <div>
          <p>{__("Date:")}</p>
          <input
            type="date"
            onChange={(e) => onDateTimeChange(e, "CHANGE_AUCTION_START_DATE")}
            min={today}
          />
        </div>
        <div>
          <p>{__("Time:")}</p>
          <input
            type="time"
            onChange={(e) => onDateTimeChange(e, "CHANGE_AUCTION_START_TIME")}
          />
        </div>
      </div>
      <div>
        <p className="header-two">{__("Auction end date:")}</p>
        <div>
          <p>{__("Date:")}</p>
          <input
            type="date"
            onChange={(e) => onDateTimeChange(e, "CHANGE_AUCTION_END_DATE")}
            min={today}
          />
        </div>
        <div>
          <p>{__("Time:")}</p>
          <input
            type="time"
            onChange={(e) => onDateTimeChange(e, "CHANGE_AUCTION_END_TIME")}
          />
        </div>
      </div>
    </div>
  );
};

const Auction = () => {
  const { state, dispatch } = useContext(CreateNftContext);

  //gurd close if no auction contract is deployed
  if (
    !state?.selectedContract?.contract?.Auction?.address ||
    state.isFreeMinting ||
    state.standard == "Erc1155"
  ) {
    return null;
  }

  const component = wp.hooks.applyFilters(
    "SMNFT_RENDER_AUCTION_COMPONENTS",
    [],
    {
      component: [
        <AuctionOpenClose key="a" />,
        <AuctionMinPrice key="b" />,
        <AuctionTime key="c" />,
      ],
    }
  );

  return <div className="auction">{component}</div>;
};

export default Auction;

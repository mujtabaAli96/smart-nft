import React, { useContext, useState } from "react";
import { CreateNftContext } from "./state";
import { errorMessage } from "../../../../common/component/message/error";
import { SLUG, FRONTENDMEDIAURL } from "../../../../common/store";
const { __ } = wp.i18n;

const Price = () => {
  const { state, dispatch } = useContext(CreateNftContext);
  const contract = state.selectedContract?.contract;
  const erc20 = state.selectedContract?.contract?.Erc20;

  if (state.auction.isAuctionSet) return null;

  const onChange = (e) => {
    const value = e.target.value;
    const valueToFloat = parseFloat(value);

    if (isNaN(valueToFloat)) {
      errorMessage(__("Invalid price", SLUG));
      dispatch({ type: "CHANGE_PRICE", payload: null });
      throw new Error("Invalid min price");
    }
    dispatch({ type: "CHANGE_PRICE", payload: value });
  };

  console.log("contract----->", contract);
  console.log("erc20----->", erc20);

  return (
    <div>
      <label htmlFor="price" className="form-wallet__label">
        <p className="form-wallet__label-text header-two">
          {__("Price", SLUG)}
        </p>
        <input
          type="text"
          id="price"
          placeholder={__("Price", SLUG)}
          value={state.price}
          onChange={onChange}
        />
        <SymbolList />
      </label>
    </div>
  );
};

const SymbolList = () => {
  const { state, dispatch } = useContext(CreateNftContext);
  const network = state.selectedContract?.network;
  const erc20 = state.selectedContract?.contract?.Erc20;

  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState(network?.currencySymbol);

  const changeCustomToken = (erc20Key) => {
    return () => {
      setSymbol(erc20Key);
      setOpen(false);
      dispatch({
        type: "SET_CUSTOM_COIN",
        payload: { isCustomCoin: true, contract: erc20[erc20Key] },
      });
    };
  };

  const defaultValue = () => {
    setSymbol(network?.currencySymbol);
    setOpen(false);
    dispatch({
      type: "SET_CUSTOM_COIN",
      payload: { isCustomCoin: false, contract: {} },
    });
  };

  let erc20Symbols = [];
  if (erc20)
    erc20Symbols = wp.hooks.applyFilters(
      "SMNFT_RENDER_MULTI_CURRENCY_SYMBOL",
      [],
      erc20
    );

  if (!erc20Symbols.length) return <span>{symbol}</span>;

  if (!open)
    return (
      <span>
        {symbol}
        <img
          onClick={() => setOpen(true)}
          src={`${FRONTENDMEDIAURL}left-arrow.svg`}
        />
      </span>
    );

  return (
    <div className="price__symbol">
      <div>
        <span onClick={defaultValue}>{network?.currencySymbol}</span>
        {erc20Symbols.map((cur, i) => (
          <span onClick={changeCustomToken(cur)} key={i}>
            {cur}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Price;

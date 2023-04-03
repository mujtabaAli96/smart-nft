import React, { useState } from "react";
import { Overview } from "./tabs/overview";
import { Properties } from "./tabs/properties";
import { History } from "./tabs/history";
import { Labels } from "./tabs/labels";
import { Stats } from "./tabs/stats";
import { Owners } from "./tabs/owners";
//import { useNftHistory } from "../../hooks/useNftInfo";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

const SingleNFtInfoTabs = ({ data }) => {
  if (data.loading) return null;
  //gurd close for dashborad controll
  //if (SETTINGS.nftpages?.single?.infotabs === "false") return;

  //main component code
  const [curTab, setCurTab] = useState(0);

  const tabs = [
    {
      comp: <Overview data={data} />,
      name: __("Overview", SLUG),
    },
    {
      comp: <Properties data={data} />,
      name: __("Properties", SLUG),
    },
    {
      comp: <Labels data={data} />,
      name: __("Labels", SLUG),
    },
    {
      comp: <Stats data={data} />,
      name: __("Stats", SLUG),
    },
    {
      comp: <Owners data={data} />,
      name: __("Owners", SLUG),
    },
    {
      comp: <History data={data} />,
      name: __("History", SLUG),
    },
  ];

  return (
    <div className="single-nft-info-tabs">
      <div className="single-nft-info-tabs__container">
        <div className="single-nft-info-tabs__header">
          {tabs.map((cur, index) => (
            <p
              className={`${"tab-name"} ${curTab == index ? "active" : ""}`}
              onClick={() => {
                setCurTab(index);
              }}
              key={index}
            >
              {cur.name}
            </p>
          ))}
        </div>
      </div>
      <div className="single-nft-info-tabs__tab">{tabs[curTab].comp}</div>
    </div>
  );
};

export { SingleNFtInfoTabs };

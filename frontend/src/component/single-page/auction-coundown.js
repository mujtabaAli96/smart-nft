import React, { useState, useEffect } from "react";

export const AuctionCountDown = ({ data }) => {
  const { endDate, endTime, isAuctionSet } = data.nftInfo.auction;

  const [countDownDate, setCoundownDate] = useState(
    new Date(`${endDate}T${endTime}:00`).getTime()
  );

  const getDayHourMinuteSecond = () => {
    const distance = countDownDate - Date.now();

    if (distance < 0) return { bidClose: true };
    let days, hours, minutes, seconds;

    days = Math.floor(distance / (1000 * 60 * 60 * 24));
    hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {
      bidClose: false,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const [coundownData, setCoundownData] = useState(getDayHourMinuteSecond());

  useEffect(() => {
    let interval = setInterval(() => {
      const data = getDayHourMinuteSecond();
      setCoundownData(data);
      if (data.bidClose) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {!coundownData.bidClose ? (
        <div className="coundown">
          <span>days:{coundownData.days}/</span>
          <span>Hours:{coundownData.hours}/</span>
          <span>Minutes:{coundownData.minutes}/</span>
          <span>Second:{coundownData.seconds}</span>
        </div>
      ) : null}
    </>
  );
};

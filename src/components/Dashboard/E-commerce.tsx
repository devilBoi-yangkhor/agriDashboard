"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
// import ChatCard from "../Chat/ChatCard";
// import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import { BsEye,  BsBag, BsCart } from "react-icons/bs";
import { BiUser } from "react-icons/bi";

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const ECommerce: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total views" total="$3.456K" rate="0.43%" levelUp>
          <BsEye fill="blue" size={22} />
        </CardDataStats>

        <CardDataStats title="Total Profit" total="$45,2K" rate="4.35%" levelUp>
          <BsCart fill="blue" size={22} />
        </CardDataStats>
        <CardDataStats title="Total Product" total="2.450" rate="2.59%" levelUp>
          <BsBag fill="blue" size={22} />
        </CardDataStats>
        <CardDataStats title="Total Users" total="3.456" rate="0.95%" levelDown>
          <BiUser fill="blue" size={22} />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          {/* <TableOne /> */}
        </div>
        {/* <ChatCard /> */}
      </div>
    </>
  );
};

export default ECommerce;

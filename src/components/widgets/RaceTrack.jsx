import React from 'react';
import data from "./trackMaps/Spain2022.json";
import {Box} from "@mui/material";
import {ResponsiveContainer, XAxis, YAxis, ScatterChart, LabelList, Cell, ZAxis, Scatter} from "recharts";
import {useSelector, useDispatch} from "react-redux";
import track from "../../assets/CatalunyaCircuit.png"
import {useSize} from "react-use";
import {selectDriver} from "../../features/drivers/driversSlice";

const rotatePoint = (x, y, deg, cx=0, cy=0) => {
  const nx = (x - cx) * Math.cos(deg * Math.PI / 180) - (y - cy) * Math.sin(deg * Math.PI / 180) + cx;
  const ny = (x - cy) * Math.sin(deg * Math.PI / 180) + (y - cy) * Math.cos(deg * Math.PI / 180) + cy;
  return [nx, ny];
}

function RaceTrack({ height }) {
  const {selected, drivers} = useSelector(state => state.drivers);
  const {currentData} = useSelector(state => state.timing);
  const dispatch = useDispatch();

  const [sized, {width}] = useSize(
    ({width}) => {
      return (
        <Box sx={{position: "absolute", top: 0, left: 0, zIndex: 0, height}}>
          <img alt={"track-layout"} height={"100%"} width={"100%"} src={track}/>
        </Box>
      )
    },
  )

  const handleClick = e => {
    const driverData = drivers.find(i => i.racingNumber.toString() === e.racingNumber.toString())
    dispatch(selectDriver(driverData.tla))
  }

  const driversWithData = Object
    .entries(currentData)
    .filter(([racingNumber, data]) => drivers.find(i => i.racingNumber === racingNumber && data.position?.x))

  return (
    <Box sx={{position: "relative", height, width: "100%"}}>
      {sized}
      <Box sx={{position: "absolute", top: 0, left: 0, zIndex: 1, height, width: "100%"}}>
        {
          isFinite(width) &&
          <ResponsiveContainer height={"100%"} width="100%" >
            <ScatterChart margin={{top: height*data.topInsetPct, left: width*data.leftInsetPct, right: width*data.rightInsetPct, bottom: height*data.bottomInsetPct}}>
              <XAxis width={0} domain={data.domain.x} tick={false} axisLine={false} hide={true} dataKey="x" type="number"/>
              <YAxis width={0} domain={data.domain.y} tick={false} axisLine={false} hide={true} dataKey="y" type="number"/>
              <ZAxis range={[0, 400]} tick={false} axisLine={false} hide={true} dataKey="z" type="number"/>
              <Scatter isAnimationActive={false} animationEasing={'linear'} onClick={handleClick} animationBegin={0} animationDuration={150} data={driversWithData
                .map(([racingNumber, {position}]) => {
                  const [x, y] = rotatePoint(position.x, position.y, data.displayRotation)
                  return {
                    x, y, z: 300, racingNumber
                  }
                })} >
                {
                  driversWithData
                    .map(([racingNumber]) => {
                      const driverData = drivers.find(i => i.racingNumber === racingNumber)
                      return <Cell key={`cell-${racingNumber}`} fill={`#${driverData.teamColour}`} />
                    })
                }
                <LabelList position={"top"} content={({ x, y, width, height, value }) => {
                  if (selected?.racingNumber !== value) return
                  return <g>
                    <rect x={x-10} y={y-18} width={35} height={height} fill="rgba(0,0,0,0.75)"></rect>
                    <text x={x + width / 2} y={y-9} fill="#fff" textAnchor="middle" dominantBaseline="middle">
                      {selected.tla}
                    </text>
                  </g>
                }} dataKey="racingNumber" />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        }
      </Box>
    </Box>
  );
}

export default RaceTrack;
import {Box, Stack, Typography} from "@mui/material";
import React from "react";
import CountUp from 'react-countup';
import { usePrevious } from "react-use"

export const Counter = ({animate=true, label, value, unit, fontSize=64}) => {
  const [counter, setCounter] = React.useState(value);
  const prevCount = usePrevious(counter);

  React.useEffect(() => {
    setCounter(value)
  }, [value])

  return (<Box sx={{
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }}>
    <Typography>{label}</Typography>
    <Stack spacing={1} justifyContent={"center"} direction={"row"}>
      <Typography marginLeft={unit ? 4 : 0} sx={{fontSize: fontSize, lineHeight: `${fontSize}px`, alignSelf: "end"}}>{
        value
          ? animate ? <CountUp useEasing={false} duration={1} start={prevCount} end={counter} /> : counter
          : "-"
      }</Typography>
      {unit && <Typography sx={{fontSize: 22, alignSelf: "end"}}>{value ? unit : ""}</Typography>}
    </Stack>
  </Box>)
}

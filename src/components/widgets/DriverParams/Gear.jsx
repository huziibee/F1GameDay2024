import {Box, Stack, Typography} from "@mui/material";
import React from "react";

export const Gear = ({label, value}) => {
  const isMinGear = parseInt(value) - 1 < 1
  const isMaxGear = parseInt(value) + 1 > 8
  return (<Box>
    <Typography>{label}</Typography>
    {
      value > 0
        ? (
          <Stack spacing={3} justifyContent={"center"} direction={"row"}>
            <Box marginLeft={isMaxGear ? -3 : 0} sx={{opacity: .25, fontSize: 48, alignSelf: "center"}}>{isMinGear ? "" : value - 1}</Box>
            <Box sx={{fontSize: 64, lineHeight: "64px", alignSelf: "center"}}>{value}</Box>
            <Box marginLeft={isMinGear ? 3 : 0} sx={{opacity: .25, fontSize: 48, alignSelf: "center"}}>{isMaxGear ? "" : value + 1}</Box>
          </Stack>
        )
        : <Box sx={{fontSize: 64, lineHeight: "64px", alignSelf: "center"}}>-</Box>
    }
  </Box>)
}

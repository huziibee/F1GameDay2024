import {Box, Stack, Typography, useTheme} from "@mui/material";
import Tyre from "../../Tyre";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectDriver} from "../../../features/drivers/driversSlice";
import { calculatePosition } from "../../../utils/data"

export const PositionTable = ({tableData=[], selected}) => {
  const theme = useTheme();
  const {currentData} = useSelector(state => state.timing);
  const {drivers} = useSelector(state => state.drivers);
  const dispatch = useDispatch()
  const selectedStyles = {
    borderRadius: 1,
    background: "rgba(144,202,249,0.25)",
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    borderRight: `3px solid ${theme.palette.primary.main}`
  }

  const handleClick = (driver) => dispatch(selectDriver(driver.tla))

  return (
    <Stack spacing={0.5}>
      {
        tableData.map((driver, idx) => {
          const driverData = drivers.find(i => i.racingNumber === driver.timing?.racingNumber)
          const { tyre={} } = driver;
          const allTyres = Object.values(tyre.stints ?? {})
          const latestTyres = Object.values(tyre.stints ?? {})[allTyres.length - 1];
          const isSelected = selected.racingNumber === driverData.racingNumber;
          return (
            <Stack key={idx} onClick={() => handleClick(driverData)} sx={{cursor: 'pointer', opacity: isSelected ? 1 : 0.5, ...(isSelected ? selectedStyles : {})}} justifyContent={"left"} p={0.25} alignItems={"center"} spacing={2} direction={"row"}>
              <Typography variant={"body1"}>{calculatePosition(currentData, driverData.racingNumber)}</Typography>
              <Box sx={{width: 5, height: 32, background: `#${driverData.teamColour}`}}/>
              <Typography variant={"body1"}>{driverData?.lastName}</Typography>
              {latestTyres?.compound && <Tyre compound={latestTyres?.compound}/>}
            </Stack>
          )
        })
      }
    </Stack>
  )
}

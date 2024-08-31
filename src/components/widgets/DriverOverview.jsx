import React from 'react';
import { useSelector } from 'react-redux';
import {Typography, Stack, Paper, Unstable_Grid2 as Grid, useMediaQuery, useTheme} from "@mui/material";
import BrakeAccel from "./DriverParams/BrakeAccel";
import {fullWidthScreenSizeLimit} from "../../constants";
import {Counter} from "./DriverParams/Counter";
import {PositionTable} from "./DriverParams/PositionTable";
import {styled} from "@mui/material/styles";
import {Gear} from "./DriverParams/Gear";
import {sortByPosition} from "../../utils/data";

const Item = styled(Paper)(() => ({
  height: "100%",
  borderRadius: 5,
  paddingTop: 4,
  paddingBottom: 4,
}));

function DriverOverview() {
  const theme = useTheme();
  const isFullWidth = useMediaQuery(theme.breakpoints.down(fullWidthScreenSizeLimit));
  const {selected: driver} = useSelector(state => state.drivers);
  const {currentData} = useSelector(state => state.timing);
  const driverData = currentData[driver.racingNumber] ?? {};
  const sorted = Object
    .entries(currentData)
    .sort((a,b) => sortByPosition(a[1], b[1]));
  const index = sorted.findIndex(i => i[0] === driver.racingNumber)
  const positionTableData = sorted
    .slice(Math.max(0, index-1), index+2)
    .map(i => i[1])
    .filter(i => i.timing)
  const {rpm, speed, gear, accel, brake, drs} = driverData?.car ?? {};

  return (
    <>
      {
        !driver
          ? <Typography variant={"h5"}>Select a driver</Typography>
          : <Stack spacing={1} padding={2}>
            <Grid spacing={2} container>
              <Grid xs={12} sm={6} lg={4} xl={3} >
                <Item>
                  <Counter label={"SPEED"} value={speed} unit={"kmh"}/>
                </Item>
              </Grid>
              <Grid xs={12} sm={6} lg={4} xl={3} >
                <Item>
                  <Counter label={"RPM"} value={rpm}/>
                </Item>
              </Grid>
              <Grid xs={12} sm={6} lg={4} xl={3} align={"right"}>
                <Item>
                  <Gear label={"GEAR"} value={gear}/>
                </Item>
              </Grid>
              <Grid xs={12} sm={6} lg={4} xl={3} align={"right"}>
                <Item sx={{backgroundColor: drs ? theme.palette.success.dark : "transparent"}}>
                  <Counter animate={false} label={"DRS"} value={drs ? "ACTIVE" : "INACTIVE"} fontSize={42}/>
                </Item>
              </Grid>
              <Grid xs={12} sm={6} lg={4} xl={6}>
                <Item>
                  <BrakeAccel brake={brake} accel={accel} align={!isFullWidth ? "right" : "left"}/>
                </Item>
              </Grid>
              {
                positionTableData.length > 0 && (
                  <Grid xs={12} sm={6} lg={4} xl={6} align={"left"}>
                    <Item sx={{padding: 1}}>
                      <PositionTable tableData={positionTableData} selected={driver}/>
                    </Item>
                  </Grid>
                )
              }
            </Grid>
          </Stack>
      }
    </>
  );
}

export default DriverOverview;
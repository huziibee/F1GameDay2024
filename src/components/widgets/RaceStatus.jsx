import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box, Stack,
} from "@mui/material";
import {selectDriver} from "../../features/drivers/driversSlice";
import Tyre, {compoundColours} from "../Tyre";
import {sortByPosition, getFastestLap} from "../../utils/data";

const getTimingColor = (hasValue, isOverallFastest, isPersonalFastest, inProgress=false) => {
  if (!hasValue) return "white"
  if (isOverallFastest) return "#f702f5"
  if (isPersonalFastest) return "#0bd00a"
  if (!inProgress) return "#e6e70e"
  return "white"
}

function RaceStatus() {
  const {drivers, selected} = useSelector(state => state.drivers);
  const {currentData} = useSelector(state => state.timing);
  const dispatch = useDispatch();
  const fastestLap = getFastestLap(currentData);

  return (
    <>
      <Box>
        <Typography id="page-title" variant={"h4"} mb={2}>FORMULA 1 PIRELLI GRAN PREMIO DE ESPAÑA 2022</Typography>
      </Box>
      <TableContainer>
        <Table sx={{width: "100%"}} size={"small"}>
          <TableHead>
            <TableRow>
              <TableCell align="center">POS</TableCell>
              <TableCell align="left">Driver</TableCell>
              <TableCell align="center">Tyre</TableCell>
              <TableCell align="center">Best Lap</TableCell>
              <TableCell align="center">Gap to Leader</TableCell>
              <TableCell align="center">Interval</TableCell>
              <TableCell align="center">Last Lap</TableCell>
              <TableCell align="left">Sectors</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Object
                .entries(currentData)
                .sort((a, b) => sortByPosition(a[1], b[1]))
                .map(([racingNumber, data], key) => {
                  const driver = drivers.find(i => i.racingNumber.toString() === racingNumber.toString())
                  const {
                    timing={},
                    tyre={},
                  } = data;

                  const allTyres = Object.values(tyre.stints ?? {})
                  const latestTyres = Object.values(tyre.stints ?? {})[allTyres.length-1];

                  return (
                    <TableRow
                      hover={true}
                      selected={selected?.tla === driver.tla} key={key}
                      onClick={() => dispatch(selectDriver(selected?.tla === driver.tla ? null : driver.tla))}
                      sx={{opacity: timing.retired || timing.stopped ? 0.5 : 1}}
                    >
                      <TableCell align="center" component="th" scope="row">{key+1}</TableCell>
                      <TableCell align="left">
                        <Stack direction={"row"} spacing={2}>
                          <Box sx={{width: 5, height: 22, background: `#${driver.teamColour}`}}/>
                          <Box>{driver.lastName}</Box>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Stack justifyContent={"center"} spacing={2} direction={"row"}>
                          <Box color={compoundColours[latestTyres?.compound]}>{latestTyres?.totalLaps ?? "-"}</Box>
                          {latestTyres?.compound && <Tyre compound={latestTyres?.compound}/>}
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Box color={getTimingColor(!!timing.bestLapTime?.value, timing.bestLapTime?.value === fastestLap, true)}>
                          {timing.bestLapTime?.value ? timing.bestLapTime?.value : "-"}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box>{timing.gapToLeader ? timing.gapToLeader : "-"}</Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box color={getTimingColor(!!timing.intervalToPositionAhead?.value, false, timing.intervalToPositionAhead?.catching)}>
                          {timing.intervalToPositionAhead?.value ? timing.intervalToPositionAhead?.value : "-"}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box>{timing.lastLapTime?.value ? timing.lastLapTime?.value : "-"}</Box>
                      </TableCell>
                      <TableCell align="left">
                        <Stack justifyContent={"left"} direction={"row"} spacing={1}>
                          {Object.values(timing.sectors ?? {}).filter(i => i.value && i.value !== "").map((i, idx) => (
                            <Box
                              key={idx}
                              sx={{width: 30, height: 10, background: getTimingColor(true, i.overallFastest, i.personalFastest)}}/>
                          )) ?? "-"}
                        </Stack></TableCell>
                    </TableRow>
                  )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

}

export default RaceStatus;

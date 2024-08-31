import React from 'react';
import {useTheme, Typography, Stack, Box} from "@mui/material";
import {useSize} from "react-use";

const BAR_WIDTH = 10;
const BAR_SPACING = 10;

const Bar = ({active, color}) => {
  return <Box m={0} component={"div"} sx={{
    width: BAR_WIDTH,
    height: 35,
    opacity: active ? 1 : 0.3,
    backgroundColor: color
  }}/>
}

function normalize(val, min=0, max=1) {
  const delta = max - min;
  return (val - min) / delta;
}

const BrakeAccelMeter = ({value, color}) => {
  const [sized, ] = useSize(
    ({width}) => {
      // bar width + 5px spacing is 15px
      // fit the max number of bars in the given space
      const barCount = Math.ceil((isFinite(width) ? width : 150)/(BAR_SPACING + BAR_WIDTH))
      return <Box>
        <Stack spacing={`${BAR_SPACING}px`} direction={"row"}>
          {
            [...Array(barCount)].map((_, idx) => {
              const normalisedBarNumber = normalize(idx+1, 0, barCount);
              const isActive = value/100 >= normalisedBarNumber;

              return <Bar
                key={idx}
                active={isActive}
                color={color}
              />
            })
          }
        </Stack>
      </Box>
    }
  )
  return sized
}

function BrakeAccel({brake, accel}) {
  const theme = useTheme()
  const styles = {
    fontSize: 18,
    textAlign: "left"
  }
  return (
    <Stack paddingX={1} spacing={0.5}>
      <Typography mb={0} sx={styles}>Accel</Typography>
      <BrakeAccelMeter color={theme.palette.primary.main} value={accel}/>
      <BrakeAccelMeter color={theme.palette.error.main} value={brake}/>
      <Typography sx={styles}>Brake</Typography>
    </Stack>
  );
}

export default BrakeAccel;
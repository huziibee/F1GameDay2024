import React, {useRef, useState} from 'react';
import {IconButton, Typography, Box, Stack} from '@mui/material';
import {PlayArrow, Pause} from '@mui/icons-material';
import WaveSurfer from 'wavesurfer.js'
import {useSelector} from "react-redux";
import {useDeepCompareEffect} from "react-use";
import getLogo from "../../assets/teamLogos";
import {selectRadioMessages} from "../../features/timing/timingSlice";
import {radioMessageTtl} from "../../constants";

const Waveform = ({ audio, color, ...props }) => {
  const containerRef = useRef();
  const waveSurferRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  useDeepCompareEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      responsive: true,
      waveColor: color,
      height: 75,
      barWidth: 6,
      barMinHeight: 1,
      barHeight: 2,
      ...props
    })
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer
    })
    waveSurfer.on('play', () => {
      setIsPlaying(true)
    })
    waveSurfer.on('pause', () => {
      setIsPlaying(false)
    })
    waveSurfer.on('finish', () => {
      setIsPlaying(false)
    })
    waveSurfer.load(audio)

    return () => {
      waveSurfer.destroy()
    }
  }, [audio, color, props])

  return <Stack direction={"row"}>
    <IconButton
      sx={{width: 50, height: 50, alignSelf: "center"}} size={"large"}
      onClick={() => waveSurferRef.current.playPause()}
    >
      {isPlaying ? <Pause/> : <PlayArrow/> }
    </IconButton>
    <Box sx={{flexGrow: 1}} ref={containerRef} />
  </Stack>
}

function PitRadio() {
  const {drivers} = useSelector(state => state.drivers);
  const radio = useSelector(selectRadioMessages);

  const leftIconHeight = 24

  return (
    <Stack spacing={0}>
      {
        radio.length === 0 && <Box p={3}>
          <Typography variant={"h5"}>No pit radio messages available</Typography>
        </Box>
      }
      {
        radio
          .filter(i => drivers.find(j => i.racingNumber === j.racingNumber))
          .map((i, idx) => {
            const driver = drivers.find(j => i.racingNumber === j.racingNumber)
            return (
              <Stack padding={2} sx={{borderBottom: "1px solid #3c4047"}} key={idx}>
                <PitRadioBar label={driver?.teamName} iconLeft={<img height={leftIconHeight} src={getLogo(driver.teamName)} alt = {driver.teamName}/>}/>
                <Box sx={{background: "#383e47"}}>
                  <Waveform audio={i.audio} color={`#${driver.teamColour}`} />
                </Box>
                <PitRadioBar label={driver?.lastName} iconLeft={<Box sx={{width: 5, height: leftIconHeight, background: `#${driver.teamColour}`}}/>}/>
              </Stack>
            )
          })
      }
    </Stack>
  );
}

const PitRadioBar = ({label, iconLeft}) => {
  return  <Stack paddingY={1} paddingX={2} sx={{background: "#1d1d1d"}} align={"left"} spacing={2} direction={"row"}>
    {iconLeft}
    <Typography variant={"body1"}>{label}</Typography>
  </Stack>
}

export default PitRadio;

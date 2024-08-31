import {useDispatch, useSelector} from 'react-redux';
import {Box, Switch, FormControlLabel} from "@mui/material";
import {updateOffset, seek} from "../../features/timing/timingSlice";
import ReactPlayer from 'react-player'
import {useEffect, useRef, useState} from "react";
import placeholder from "../../assets/f1slate2.png"

function Video() {
  const {timingEvents} = useSelector(state => state.timing);
  const dispatch = useDispatch();
  const [showVideo, setShowVideo] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const playerRef = useRef();
  const data = useSelector(state => state.event);

  useEffect(() => {
    setReady(e => e ? e : timingEvents?.length > 0 && videoLoaded);
  }, [timingEvents, videoLoaded])

  const handleProgress = ({playedSeconds}) => {
    dispatch(updateOffset(playedSeconds))
  }


  const handleSeek = (seconds) => {
    // playerRef.current.seekTo(offset)
    setReady(false);
    dispatch(seek(seconds))
  }

  const handleReady = () => setVideoLoaded(true);

  return (
    <Box>
      <FormControlLabel control={<Switch onChange={e => setShowVideo(e.target.checked)} checked={showVideo}/>}
                        label="Show Video"/>
      {ready && <Box id={"video-loaded"}/>}
      <Box sx={{position: "relative", paddingTop: "56.25%"}}>
        <ReactPlayer
          ref={playerRef}
          style={{position: "absolute", zIndex: 1, top: 0, left: 0, opacity: showVideo ? 1 : 0}}
          muted={true}
          playing={ready}
          pip={false}
          playbackRate={1}
          config={{
            file: {
              forceHls: true,
              attributes: {
                controlsList: "nofullscreen nodownload noremoteplayback",
                disableRemotePlayback: true,
                disablePictureInPicture: true,
                poster: placeholder
              },
            }
          }}
          controls={true}
          width={"100%"}
          height={"auto"}
          url={data?.videoUrl}
          progressInterval={150}
          onProgress={handleProgress}
          onSeek={handleSeek}
          onReady={handleReady}
        />
        <Box sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundSize: "cover",
          zIndex: 0,
          backgroundImage: `url(${placeholder})`
        }}/>
      </Box>
    </Box>
  );
}

export default Video;
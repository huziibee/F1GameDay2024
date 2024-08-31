import React, {useEffect, useState} from 'react';
import {
  DriverOverview,
  PitRadio,
  RaceStatus,
  RaceTrack,
  Video
} from "./components/widgets";
import {
  Box,
  Unstable_Grid2 as Grid,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Typography,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { SwapHorizontalCircle as ConnectedIcon, Logout } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import {useSelector, useDispatch} from "react-redux";
import {queueEvents} from "./features/timing/timingSlice";
import {setDrivers} from "./features/drivers/driversSlice";
import {
  API_GATEWAY_ENDPOINT,
  AWS_USER_POOL_ID, AWS_USER_POOL_WEB_CLIENT_ID,
  fullWidthScreenSizeLimit,
  USE_AUTH
} from "./constants";
import useStaticData from "./hooks/useStaticData";
import useTimingData from "./hooks/useTimingData";
import {
  Authenticator,
  ThemeProvider,
} from '@aws-amplify/ui-react';
import useAmplifyTheme from "./hooks/useAmplifyTheme";
import useEventData from "./hooks/useEventData";
import {setEvent} from "./features/event/eventSlice";
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { SnackbarProvider } from 'notistack';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ConnectedIndicator = () => {
  return (
    <Box id={"connected-indicator"}>
      <Tooltip placement={"bottom"} title="Connected to API">
        <ConnectedIcon color={"success"}/>
      </Tooltip>
    </Box>
  )
}

const checkEnvVars = () => {
  if (!API_GATEWAY_ENDPOINT) throw new Error("No API Gateway endpoint configured. Ensure the REACT_APP_API_GATEWAY_ENDPOINT environment variable is set correctly on your Amplify project then redeploy your app")
  if (USE_AUTH) {
    if([
      AWS_USER_POOL_ID,
      AWS_USER_POOL_WEB_CLIENT_ID
    ].some(i =>  !i)) throw new Error("When using Cognito auth, ensure the REACT_APP_AWS_USER_POOL_ID and REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID environment variables are set correctly on your Amplify project then redeploy your app")
  }
}

function App({ signOut }) {
  const theme = useTheme();
  const isFullWidth = useMediaQuery(theme.breakpoints.down(fullWidthScreenSizeLimit));
  const isXxl = useMediaQuery(theme.breakpoints.up('xxl'));
  const {drivers, selected} = useSelector(state => state.drivers);
  const {window: timingWindow} = useSelector(state => state.timing);
  const event = useSelector(state => state.event);
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const {data: eventData} = useEventData();
  const {data: staticData} = useStaticData();
  const {data: timingData} = useTimingData(timingWindow.from, timingWindow.to, {enabled: ready});

  useEffect(() => {
    if (timingData?.events?.length > 0) {
      dispatch(queueEvents(timingData.events))
    }
  }, [timingData, dispatch]);

  useEffect(() => {
    if (eventData) {
      dispatch(setEvent(eventData))
    }
  }, [eventData, dispatch]);

  useEffect(() => {
    // Other logic to determine readiness goes here
    if (drivers?.length > 0 && event?.videoUrl) {
      setReady(true)
    }
  }, [drivers, event])

  useEffect(() => {
    if (staticData) {
      dispatch(setDrivers(staticData.drivers))
    }
  }, [dispatch, staticData]);

  checkEnvVars();

  if (!ready) {
    return (
      <Box component={Paper} padding={5} align={"center"} square sx={{width: "100vw", height: "100vh"}}>
        <CircularProgress/>
        <Typography variant={"h5"}>Loading dashboard...</Typography>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{position: "fixed", left: theme.spacing(1), top: theme.spacing(1), zIndex: 999}} align={"right"}>
        <ConnectedIndicator/>
      </Box>
      { signOut &&
      <Box sx={{position: "fixed", right: theme.spacing(3), top: theme.spacing(1), zIndex: 999}} align={"right"}>
        <Tooltip title={"Sign Out"}>
          <IconButton size={"small"} onClick={signOut}>
            <Logout/>
          </IconButton>
        </Tooltip>
      </Box>}
      <CssBaseline enableColorScheme />
      <Paper square sx={{padding: 0, margin: 0}}>
        <Grid container disableEqualOverflow>
          <Grid xs={12} sm={12} md={3} lg={3} xxl={3} xxxl={2}>
            <Stack sx={!isFullWidth ? {height: "calc(100vh - 2px)", overflow: "auto"} : {}}>
              <Item sx={{height: "auto", padding: 0}}><Video /></Item>
              <Item sx={{height: "auto", padding: 0}}><RaceTrack height={isXxl ? 250 : 200} title="Race Track"/></Item>
              <Item sx={{height: "auto", flexGrow: 1, borderBottom: 0, padding: 0}}><PitRadio title="Pit Radio" /></Item>
            </Stack>
          </Grid>
          <Grid xs={12} sm={12} md={9} lg={9} xxl={9} xxxl={10}>
            <Stack sx={!isFullWidth ? {height: "calc(100vh - 2px)"} : {}}>
              <Item sx={!isFullWidth ? {borderBottom: 0, maxHeight: selected ? "70vh" : "100vh", overflow: "auto"} : {borderBottom: 0}}>
                <RaceStatus/>
              </Item>
              {
                selected && <Item sx={{flexGrow: 1, borderBottom: 0}}><DriverOverview title="Driver Params"/></Item>
              }
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

const ErrorBoundaryApp = () => {
  const theme = useAmplifyTheme();
  return (
    <SnackbarProvider maxSnack={3}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ error }) => (
              <Stack spacing={2} p={4} align={"center"}>
                <Typography color={"white"} variant={"h5"} textAlign={"center"}>Error loading dashboard!</Typography>
                <Typography color={"error"}>{error.message}</Typography>
                <Box>
                  <Button size={"large"} variant={"contained"} onClick={() => window.location.reload()}>Refresh Page</Button>
                </Box>
              </Stack>
            )}>
            {
              USE_AUTH
                ? (
                  <ThemeProvider theme={theme}>
                    <Authenticator>
                      {({ signOut, user }) => (
                        <App signOut={signOut} user={user}/>
                      )}
                    </Authenticator>
                  </ThemeProvider>
                )
                : <App/>
            }
           </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </SnackbarProvider>
   )
}

export default ErrorBoundaryApp;

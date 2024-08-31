import useApi from "./useApi";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import {useSnackbar} from "notistack";

const KEY = "live"

export const useTimingData = (from, to, config) => {
  const {get} = useApi()
  const {event} = useParams()
  const { enqueueSnackbar } = useSnackbar();

  return useQuery([KEY, event, from, to], () => get(`/event/${event}/timed?from=${from.toFixed(4)}&to=${to.toFixed(4)}`), {
    retry: 0,
    refetchOnWindowFocus: false,
    onError: err => {
      console.error(err);
      enqueueSnackbar("Error retrieving timing data", {
        variant: "error",
        autoHideDuration: 3000,
        preventDuplicate: true,
      })
    },
    ...config
  })
}

export default useTimingData

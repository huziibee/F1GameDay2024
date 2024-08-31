import {useQuery} from "@tanstack/react-query";
import useApi from "./useApi";
import {useParams} from "react-router-dom";
import {USE_AUTH} from "../constants";

const KEY = "event"

export const useEventData = () => {
  const { get } = useApi()
  const {event} = useParams()
  return useQuery([KEY, event], () => get(`/event/${event}`)
    .catch(err => {
      console.error(err)
      throw new Error(`Unable to retrieve event data. Please verify the API endpoint and API Key (if configured on the API) ${USE_AUTH ? "and Cognito " : ""}environment variables have the correct values and that the API Gateway is auth is configured correctly`);})
    .then(res => {
      if (!res?.videoUrl) {
        throw new Error(`No video URL present in event data. Check the event Lambda function`);
      }
      return res
    }), {
    retry: false,
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
  })
}

export default useEventData

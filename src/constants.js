export const fullWidthScreenSizeLimit = "md";
export const radioMessageTtl = 60;
export const windowSize = 10.0;
export const seekLookbackSize = 10.0;
export const bufferThreshold = .3; // only 30% of buffer remaining
export const DEFAULT_EVENT = import.meta.env.REACT_APP_EVENT ?? "Spain2022Race";

/************* ENVIRONMENT VARIABLES TO BE FULFILLED **************/
export const USE_AUTH = (import.meta.env.REACT_APP_USE_AUTH ?? "false") === "true";
export const AWS_REGION = import.meta.env.REACT_APP_AWS_REGION ?? "us-east-1";
export const API_GATEWAY_ENDPOINT = import.meta.env.REACT_APP_API_GATEWAY_ENDPOINT ?? '';
export const AWS_USER_POOL_ID = import.meta.env.REACT_APP_AWS_USER_POOL_ID ?? '';
export const AWS_USER_POOL_WEB_CLIENT_ID = import.meta.env.REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID ?? '';
export const AWS_COGNITO_IDENTITY_POOL_ID = import.meta.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID ?? '';
export const STORAGE_BUCKET = import.meta.env.REACT_APP_STORAGE_BUCKET ?? '';
export const API_KEY = import.meta.env.REACT_APP_API_KEY;
/************* END OF ENVIRONMENT VARIABLES TO BE FULFILLED **************/

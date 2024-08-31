import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@aws-amplify/ui-react/styles.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import { store } from './store';
import {createTheme, ThemeProvider} from "@mui/material";
import {Amplify, Auth} from 'aws-amplify';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  API_GATEWAY_ENDPOINT,
  AWS_COGNITO_IDENTITY_POOL_ID,
  AWS_REGION,
  AWS_USER_POOL_ID,
  AWS_USER_POOL_WEB_CLIENT_ID,
  STORAGE_BUCKET,
  API_KEY,
  DEFAULT_EVENT, USE_AUTH,
} from "./constants";

/********** AMPLIFY CONFIG ***********/
Amplify.configure({
  ...(USE_AUTH ? {
    Auth: {
      // Amazon Cognito Identity Pool ID
      identityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
      // Amazon Cognito Region
      region: AWS_REGION,
      // Amazon Cognito User Pool ID
      userPoolId: AWS_USER_POOL_ID,
      // Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: AWS_USER_POOL_WEB_CLIENT_ID,
    }
  } : {}),
  API: {
    endpoints: [
      {
        "name": "backend-gdf1-api",
        "endpoint": API_GATEWAY_ENDPOINT,
        "region": AWS_REGION,
        "authorizationType": "API_KEY",
        custom_header: async () => {
          const headers = {}
          if (API_KEY) headers[ "x-api-key"] = API_KEY
          if (USE_AUTH) headers["Authorization"] = `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
          return headers
        }
      },
    ]
  },
  ...(STORAGE_BUCKET ? {
    Storage: {
      AWSS3: {
        bucket: STORAGE_BUCKET,
        region: AWS_REGION,
      }
    }
  } : {})
});
/********** END AMPLIFY CONFIG ***********/

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/:event",
    element: <App />,
  },
  {
    path: "/",
    loader: () => redirect(`/${DEFAULT_EVENT}`),
  },
]);

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 2000,
      xxxl: 2400,
    },
  },
  typography: {
    fontWeightRegular: 'bold',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A2027',
        },
      },
      defaultProps: {
        elevation: 0,
        variant: "outlined",
        square: true
      }
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </ThemeProvider>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

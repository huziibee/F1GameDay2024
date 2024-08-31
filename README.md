# F1 GameDay Dashboard Frontend

This repo contains the frontend code for the F1 GameDay dashboard.

## Environment variables required

In order to run the application a number of environment variables are required
at build time:

- `REACT_APP_AWS_REGION`: the region your backend infrastructure is deployed in,
  e.g. `us-east-1`
- `REACT_APP_API_GATEWAY_ENDPOINT`: the API Gateway URL including the protocol and stage
  without trailing slash e.g. `https://abcd1234.execute-api.us-east-1.amazonaws.com/prod`.
  You can obtain this value by choosing your API Gateway
  in the console > API Keys > Stages > your stage (e.g. prod) then copy the
  **invoke url**

The following environment variables are required if using API Keys with
API Gateway:

- `REACT_APP_API_KEY`: an API key for your API Gateway. Ensure this value is
  alphanumeric only and does not contain forward/backslash characters or dollar signs
  e.g. `bPxRfiCYEXAMPLEKEY`. You can obtain this value by choosing your API Gateway
  in the console > API Keys > your key > show

The following environment variables are required if using Cognito for auth:

- `REACT_APP_AWS_USER_POOL_ID`: the ID of the Cognito user pool being used
  for authentication. e.g. `us-east-1_ExAmPlE1`. You can obtain this value
  by choosing your user pool in the console then copying the value next to
  **Pool Id**
- `REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID`: the ID of the Cognito App client
  for your user pool being used by the UI e.g. `123456ABCdef`. You can obtain this value
  by choosing your user pool in the console > App client settings then copying the
  ID displayed under the client name
- `REACT_APP_USE_AUTH`: set this to `true` to instruct the UI to use the
  Amplify Authenticator component

The following environment variables are supported for backwards compatibility and
will be parsed and stored if supplied, but are no longer used by the application:
- `REACT_APP_STORAGE_BUCKET`: the name of the S3 bucket used for storing assets
  such as Pit Radio mp3 files e.g. `doc-example-bucket1`
- `REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID`: the ID of the Cognito Identity Pool
  to use to obtain temporary AWS credentials e.g. `us-east-1:a1b2c3d4-5678-90ab-cdef-EXAMPLE11111`.
  You can obtain this value by choosing your Federated Identities in the Cognito
  console > your identity pool > Edit identity pool then copying the value displayed
  next to Identity pool ID. This is no longer used

For details on how to set these environment variables, see the relevant section below
based on how you are running the application.

#### Option 1. Deploying to AWS Amplify via the AWS Console

1. Create a CodeCommit repository and push this code to it
2. Create a new AWS Amplify web app hosting project and configure it to connect to the repository
   created in step 1
3. Create environment variables on the project for each of the keys defined above (where required) and provide relevant values
   for your environment. You can specify environment variables :
   1. Whilst creating a web hosting project by expanding the **Advanced Settings** section in step 2 of
      "Host your web app" in the console OR
   2. After creating your app by choosing **Environment variables** from the sidebar
4. After updating any environment variables, redeploy the application.

#### Option 2. Running Locally (local development)

This section is only relevant if you are developing the application and are
making code changes that you want to test locally.

1. Checkout the repo and `cd` to the repo root
2. Install the dependencies: `npm install`
3. Create your `.env.local` file: `cp .env.example .env.local`
4. Populate the `.env.local` with the relevant values for your environment
5. Start the app: `npm start`

## Enabling Cognito User Pool Authentication

To enable Cognito User Pool Authentication and to add the JWT in the Authorization
modify set the `REACT_APP_USE_AUTH` env var to `true`. Any other value, including
the env var not being set will result in no auth being applied.

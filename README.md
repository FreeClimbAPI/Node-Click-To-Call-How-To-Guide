# Node Click To Call How-To Guide

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Click To Call CI](https://github.com/FreeClimbAPI/Node-Click-To-Call-Tutorial/actions/workflows/node-click-to-call-sample.yaml/badge.svg?branch=main)](https://github.com/FreeClimbAPI/Node-Click-To-Call-Tutorial/actions/workflows/node-click-to-call-sample.yaml)
[![Coverage Status](https://coveralls.io/repos/github/FreeClimbAPI/Node-Click-To-Call-Tutorial/badge.svg?branch=main)](https://coveralls.io/github/FreeClimbAPI/Node-Click-To-Call-Tutorial?branch=main)

This project serves as a guide to help you build a click to call application with [FreeClimb](https://docs.freeclimb.com/docs/how-freeclimb-works).

Specifically, the project will:

- Get phone numbers via a webpage
- Create an outgoing call using the [FreeClimb API](https://docs.freeclimb.com/reference/using-the-api)
- Create a conference using [PerCL](https://docs.freeclimb.com/reference/percl-overview)
- Connect an agenct and caller in a conference using [PerCL](https://docs.freeclimb.com/reference/percl-overview)

## Sample App How-To Guide
We offer a [Click to Call via Web Browser tutorial](https://docs.freeclimb.com/docs/click-to-call-via-web-browser) for more detailed set-up instructions and explanation of how the code in this click to call sample app works.


## Requirements
A [FreeClimb account](https://www.freeclimb.com/dashboard/signup/)

A [registered application](https://docs.freeclimb.com/docs/registering-and-configuring-an-application#register-an-app) with a named alias

A [configured FreeClimb number](https://docs.freeclimb.com/docs/getting-and-configuring-a-freeclimb-number) assigned to your application

Trial accounts: a [verified number](https://docs.freeclimb.com/docs/using-your-trial-account#verifying-outbound-numbers)

Tools:
- [Node.js](https://nodejs.org/en/download/) 12.14.0 or higher
- [Yarn](https://yarnpkg.com/en/)
- [ngrok](https://ngrok.com/download) (optional for hosting)

## Setting up the Sample App

1. Install the required packages

    ```bash
    yarn install
    ```

1. Create a .env file and configure the following environment variables within it:

    | ENV VARIABLE    | DESCRIPTION                                                                                                                                                                                                                               |
    | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | ACCOUNT_ID      | Account ID which can be found under [API credentials](https://www.freeclimb.com/dashboard/portal/account/authentication) in dashboard.                                                                                                         |
    | API_KEY      | API key which can be found under [API credentials](https://www.freeclimb.com/dashboard/portal/account/authentication) in dashboard.                                                                                                  |
    | APP_ID      | Application Id associated with your freeclimb app can be found under [Apps](https://www.freeclimb.com/dashboard/portal/applications/authentication) in dashboard.                                                                                                  |
    | HOST            | The hostname as defined in your FC application. We recommend [ngrok](https://ngrok.com/download) as an option to get up and running quickly.                                                                                                                                                                                            |
    | PORT            | Specifies the port on which the app will run (e.g. PORT=3000 means you would direct your browser to http://localhost:3000).                                                                                                                                                                                              |
    | FC_NUMBER       | The FreeClimb phone number associated with your application.                                                                                                                                                                                             |
    
## Running the Sample App

```bash
yarn start
```

## Feedback & Issues
If you would like to give the team feedback or you encounter a problem, please [contact support](https://www.freeclimb.com/support/) or [submit a ticket](https://freeclimb.com/dashboard/portal/support) in the dashboard.

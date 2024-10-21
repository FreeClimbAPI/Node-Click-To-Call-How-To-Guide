const freeclimbSDK = require('@freeclimb/sdk')
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const configuration = freeclimbSDK.createConfiguration({ accountId, apiKey, baseServer: new freeclimbSDK.ServerConfiguration('https://dev.freeclimb.com/apiserver') })
const freeclimb = new freeclimbSDK.DefaultApi(configuration)

module.exports = freeclimb

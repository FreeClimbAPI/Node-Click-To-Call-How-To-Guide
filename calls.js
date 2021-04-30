const freeclimb = require('./freeclimb')

exports.createCall = async(to,from,callback) => {
    const appId = process.env.APP_ID
    await freeclimb.api.calls.create(to,from, appId, { callConnectUrl: callback, ifMachine: freeclimb.enums.ifMachine.HANGUP })
}
const freeclimb = require('./freeclimb')

exports.createCall = async (to, from, callback) => {
    const applicationId = process.env.APP_ID
    await freeclimb.makeACall({ to, from, applicationId, callConnectUrl: callback, ifMachine: freeclimb.IfMachine.HANGUP })
}

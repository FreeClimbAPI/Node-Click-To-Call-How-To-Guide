const freeclimb = require('./freeclimb')
const { IfMachine } = require('@freeclimb/sdk')

exports.createCall = async (to, from, callback) => {
    const applicationId = process.env.APP_ID
    await freeclimb.makeACall({ to, from, applicationId, callConnectUrl: callback, ifMachine: IfMachine.HANGUP })
}

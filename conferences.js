const freeclimb = require('./freeclimb')
const { ConferenceStatus } = require('@freeclimb/sdk')

exports.terminate = async conferenceId => {
    const conference = await freeclimb.getAConference(conferenceId)
    const status = conference.status

    if (status !== 'terminated') {
        await freeclimb.updateAConference(conferenceId, { status: ConferenceStatus.TERMINATED })
    }
}

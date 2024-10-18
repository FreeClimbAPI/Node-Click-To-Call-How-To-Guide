const freeclimb = require('./freeclimb')

exports.terminate = async conferenceId => {
    const conference = await freeclimb.getAConference(conferenceId)
    const status = conference.status

    if (status !== 'terminated') {
        await freeclimb.updateAConference(conferenceId, { status: freeclimb.ConferenceStatus.TERMINATED })
    }
}

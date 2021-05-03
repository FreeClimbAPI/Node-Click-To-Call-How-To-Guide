const freeclimb = require('./freeclimb')

exports.terminate = async conferenceId => {
    const conference = await freeclimb.api.conferences.get(conferenceId)
    const status = conference.status

    if (status !== 'terminated') {
        await freeclimb.api.conferences.update(conferenceId, {
            status: freeclimb.enums.conferenceStatus.TERMINATED
        })
    }
}

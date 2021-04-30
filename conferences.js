const freeclimb = require('./freeclimb')

exports.get = async(conferenceId) => {
    return await freeclimb.api.conferences.get(conferenceId)
}

exports.update = (conferenceId, status) =>{
    freeclimb.api.conferences.update(
        conferenceId,
        {
            status: status
        }
    )
}

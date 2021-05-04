require('dotenv-safe').config()
const express = require('express')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const freeclimb = require('./freeclimb')
const calls = require('./calls')
const conferences = require('./conferences')

const app = express()

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 3000
const host = process.env.HOST
const fcNumber = process.env.FC_NUMBER

app.get('/', (req, res) => {
    res.status(200).render('inputPhone')
})

app.post('/reset', (req, res) => {
    res.status(200).render('inputPhone')
})

app.post('/startCall', async (req, res) => {
    const caller = req.body.caller
    const agent = req.body.agent
    try {
        await calls.createCall(agent, fcNumber, `${host}/agentPickup/${caller}`)
        res.status(200).render('callMade')
    } catch (err) {
        console.error(err)
        res.status(500).render('inputPhone', {
            error:
                'Your call could not be made. Please ensure you have correctly entered both phone numbers.'
        })
    }
})

app.post('/agentPickup/:caller', async (req, res) => {
    const caller = req.params.caller
    res.status(200).json(
        freeclimb.percl.build(
            freeclimb.percl.createConference(`${host}/conferenceCreated/${caller}`)
        )
    )
})

app.post('/conferenceCreated/:caller', async (req, res) => {
    const conferenceId = req.body.conferenceId
    const caller = req.params.caller
    res.status(200).json(
        freeclimb.percl.build(
            freeclimb.percl.outDial(
                caller,
                process.env.FC_NUMBER,
                `${host}/userCalled/${conferenceId}`,
                `${host}/userConnected/${conferenceId}`,
                { ifMachine: freeclimb.enums.ifMachine.HANGUP }
            )
        )
    )
})

app.post('/userCalled/:conferenceId', (req, res) => {
    const conferenceId = req.params.conferenceId
    const callId = req.body.callId
    res.status(200).json(
        freeclimb.percl.build(
            freeclimb.percl.say('please wait while we attempt to add your client to the call'),
            freeclimb.percl.addToConference(conferenceId, callId, {
                leaveConferenceUrl: `${host}/leftConference`
            })
        )
    )
})

app.post('/hangup', (req, res) => {
    res.status(200).json(freeclimb.percl.build(freeclimb.percl.hangup()))
})

app.post('/userConnected/:conferenceId', async (req, res) => {
    const conferenceId = req.params.conferenceId
    const callId = req.body.callId
    if (req.body.dialCallStatus != freeclimb.enums.callStatus.IN_PROGRESS) {
        await conferences.terminate(conferenceId)
    }
    res.status(200).json(
        freeclimb.percl.build(
            freeclimb.percl.addToConference(conferenceId, callId, {
                leaveConferenceUrl: `${host}/leftConference`
            })
        )
    )
})

app.post('/leftConference', async (req, res) => {
    const conferenceId = req.body.conferenceId
    await conferences.terminate(conferenceId)
    res.status(200).json([])
})

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Starting server on port ${port}`)
    })
}

module.exports = { app }

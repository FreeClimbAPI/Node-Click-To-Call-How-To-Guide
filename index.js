require('dotenv-safe').config()
const express = require('express')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const {
    PerclScript,
    CreateConference,
    OutDial,
    IfMachine,
    Say,
    AddToConference,
    CallStatus
} = require('@freeclimb/sdk')
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
        new PerclScript({
            commands: [new CreateConference({ actionUrl: `${host}/conferenceCreated/${caller}` })]
        }).build()
    )
})

app.post('/conferenceCreated/:caller', async (req, res) => {
    res.status(200).json(
        new PerclScript({
            commands: [
                new OutDial({
                    callingNumber: req.params.caller,
                    destination: process.env.FC_NUMBER,
                    actionUrl: `${host}/userCalled/${req.body.conferenceId}`,
                    callConnectUrl: `${host}/userConnected/${req.body.conferenceId}`,
                    ifMachine: IfMachine.HANGUP
                })
            ]
        }).build()
    )
})

app.post('/userCalled/:conferenceId', (req, res) => {
    res.status(200).json(
        new PerclScript({
            commands: [
                new Say({ text: 'Please wait while we attempt to add your client to the call' }),
                new AddToConference({
                    conferenceId: req.params.conferenceId,
                    callId: req.body.callId,
                    leaveConferenceUrl: `${host}/leftConference`
                })
            ]
        }).build()
    )
})

app.post('/userConnected/:conferenceId', async (req, res) => {
    const conferenceId = req.params.conferenceId
    const callId = req.body.callId
    if (req.body.dialCallStatus != CallStatus.IN_PROGRESS) {
        await conferences.terminate(conferenceId)
        res.status(500).json([])
    } else {
        res.status(200).json(
            new PerclScript({
                commands: [
                    new AddToConference({
                        conferenceId,
                        callId,
                        leaveConferenceUrl: `${host}/leftConference`
                    })
                ]
            }).build()
        )
    }
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

let request

const host = process.env.HOST
const fcNumber = process.env.FC_NUMBER

beforeEach(() => {
    jest.resetModules()
    const { app } = require('./index')
    const supertest = require('supertest')

    request = supertest(app)
})

describe('GET /', () => {
    it('renders FreeClimb click-to-call layout and input phone form', async () => {
        const res = await request.get('/')
        expect(res.status).toBe(200)
        expect(res.text).toContain('FreeClimb Click To Call Sample')
        expect(res.text).toContain(
            'Please enter your phone number and the phone number of the desired agent in E.164 format (e.g. +1234567891)'
        )
    })
})

describe('POST /reset', () => {
    it('renders FreeClimb click-to-call layout and input phone form page', async () => {
        const res = await request.post('/reset')
        expect(res.status).toBe(200)
        expect(res.text).toContain('FreeClimb Click To Call Sample')
        expect(res.text).toContain(
            'Please enter your phone number and the phone number of the desired agent in E.164 format (e.g. +1234567891)'
        )
    })
})

describe('POST /startCall', () => {
    it('attempts outdial and returns status code 200 on success', async () => {
        const calls = require('./calls')
        const fcSpy = jest.spyOn(calls, 'createCall').mockImplementation((to, from, callback) => { })
        const res = await request.post('/startCall', {
            caller: '+11001001001',
            agent: '+11001001001'
        }) //mock fc api call
        expect(fcSpy).toHaveBeenCalled()
        expect(res.status).toBe(200)
    })

    it('attempts outdial and returns status code 500 on failure, renders error message', async () => {
        const calls = require('./calls')
        const fcSpy = jest.spyOn(calls, 'createCall').mockImplementation((to, from, callback) => {
            throw new Error('fake error')
        })
        const res = await request.post('/startCall', {
            caller: '+11001001001',
            agent: '+11001001001'
        }) //mock fc api call
        expect(fcSpy).toHaveBeenCalled()
        expect(res.status).toBe(500)
        expect(res.text).toContain(
            'Your call could not be made. Please ensure you have correctly entered both phone numbers.'
        )
    })
})

describe('POST /agentPickup/:caller', () => {
    it('returns the percl commands to create a conference', async () => {
        const res = await request.post('/agentPickup/+1')
        expect(res.status).toBe(200)
        expect(res.body).toStrictEqual([
            {
                CreateConference: {
                    actionUrl: `${host}/conferenceCreated/+1`,
                    playBeep: "always"
                }
            }
        ])
    })
})

describe('POST /conferenceCreated/:caller', () => {
    it('returns the percl commands to create a new outDial', async () => {
        const res = await request
            .post('/conferenceCreated/+1')
            .type('form')
            .send({ conferenceId: 'fakeId' })
        expect(res.status).toBe(200)
        expect(res.body).toStrictEqual([
            {
                OutDial: {
                    actionUrl: `${host}/userCalled/fakeId`,
                    callConnectUrl: `${host}/userConnected/fakeId`,
                    callingNumber: `${fcNumber}`,
                    destination: '+1',
                    ifMachine: 'hangup'
                }
            }
        ])
    })
})

describe('POST /userCalled/:conferenceId', () => {
    it('returns the percl commands to add agent call leg into conference', async () => {
        const res = await request
            .post('/userCalled/fakeConferenceId')
            .type('form')
            .send({ callId: 'fakeCallId' })
        expect(res.status).toBe(200)
        expect(res.body).toStrictEqual([
            {
                Say: {
                    text: 'please wait while we attempt to add your client to the call',
                    loop: 1
                }
            },
            {
                AddToConference: {
                    conferenceId: 'fakeConferenceId',
                    leaveConferenceUrl: `${host}/leftConference`
                }
            }
        ])
    })
})

describe('POST /userConnected/:conferenceId', () => {
    it('returns the percl commands to add caller to conference if agent call is in progress', async () => {
        const res = await request
            .post('/userConnected/fakeConferenceId')
            .type('form')
            .send({ callId: 'fakeCallId', dialCallStatus: 'inProgress' })
        expect(res.status).toBe(200)
        expect(res.body).toStrictEqual([
            {
                AddToConference: {
                    conferenceId: 'fakeConferenceId',
                    leaveConferenceUrl: `${host}/leftConference`
                }
            }
        ])
    })

    it('terminates the call if the agent has not picked up', async () => {
        const conferences = require('./conferences')
        const fcSpy = jest.spyOn(conferences, 'terminate').mockImplementation(conferenceId => { })

        const res = await request
            .post('/userConnected/fakeConferenceId')
            .type('form')
            .send({ callId: 'fakeCallId', dialCallStatus: 'terminated' })
        expect(fcSpy).toHaveBeenCalled()
        expect(res.status).toBe(500)
        expect(res.body).toStrictEqual([])
    })
})

describe('POST /leftConference', () => {
    it('invokes the command to terminate the conference', async () => {
        const conferences = require('./conferences')
        const fcSpy = jest.spyOn(conferences, 'terminate').mockImplementation(conferenceId => { })

        const res = await request
            .post('/leftConference')
            .type('form')
            .send({ conferenceId: 'fakeConferenceId' })
        expect(res.status).toBe(200)
        expect(fcSpy).toHaveBeenCalledWith('fakeConferenceId')
    })
})

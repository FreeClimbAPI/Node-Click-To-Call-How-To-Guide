let request

beforeEach(() => {
    jest.resetModules()
    const { app } = require('./index')
    const supertest = require('supertest')
    request = supertest(app)
})

describe('GET /', () => {
    it(' / returns status 200 (sample test)', async () => {
        const res = await request.get('/')
        expect(res.status).toBe(200)
    })
})

let request

beforeEach(() => {
    jest.resetModules()
    const { app } = require('./index')
    const supertest = require('supertest')
    request = supertest(app)
})

describe('GET /', () => {
    it('renders the inputPhone template', async () => {
        const res = await request.get('/')
        expect(res.status).toBe(200)
    })
})



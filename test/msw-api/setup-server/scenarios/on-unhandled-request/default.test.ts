/**
 * @jest-environment node
 */
import fetch from 'node-fetch'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer(
  rest.get('https://test.mswjs.io/user', (req, res, ctx) => {
    return res(ctx.json({ firstName: 'John' }))
  }),
)

beforeAll(() => {
  server.listen()
  jest.spyOn(global.console, 'error').mockImplementation()
  jest.spyOn(global.console, 'warn').mockImplementation()
})

afterAll(() => {
  server.close()
  jest.restoreAllMocks()
})

test('warns on unhandled requests by default', async () => {
  const res = await fetch('https://test.mswjs.io')

  // Request should be performed as-is
  expect(res).toHaveProperty('status', 404)

  expect(console.error).not.toBeCalled()
  expect(console.warn).toBeCalledWith(`\
[MSW] Warning: captured a request without a matching request handler:

  • GET https://test.mswjs.io/

If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/getting-started/mocks`)
})

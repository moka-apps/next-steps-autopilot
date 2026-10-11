import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

const START = { cwd: '/', surface: 'terminal', isInteractive: true } as const
const ANSWER = 'x'.repeat(200)
const TURN = { answer: ANSWER, durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' } as const
const FORK = JSON.stringify([
  { label: 'Run the tests', prompt: 'run the tests' },
  { label: 'Commit', prompt: 'commit it' },
])

// Stands for the engine: the fork's answer, the clock, and what was submitted.
const host = (on: On, read: () => unknown = () => ({ value: { text: '', cursor: 0 } })) => {
  const seen = { submitted: [] as string[], toasts: [] as string[], registered: [] as string[], forks: 0 }
  const clock = mock.clock(on)
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('command.register', (_, e) => (seen.registered.push(e.name), { value: { command: e.name } }) as never)
  on('command.list', () => ({ value: [] }))
  on('model.fork', () => ((seen.forks += 1), { value: { isAnswered: true, text: FORK, usage: {} } }) as never)
  on('prompt.read', () => read() as never)
  on('prompt.suggest', () => ({ isShown: true }) as never)
  on('turn.complete', () => ({ text: 'done' }))
  on('prompt.submit', (_, e) => {
    if (e.origin.kind === 'plugin') seen.submitted.push(e.text)
    return { text: e.text }
  })
  on('ui.toast', (_, e) => {
    seen.toasts.push(e.text)
    return { value: undefined }
  })
  return { seen, clock }
}

test('suggestions are drawn above the prompt and never sent', async ($, on) => {
  const { seen, clock } = host(on)
  on('ui.render', { component: 'AbovePrompt' }, ($, e) => $.ui.resolve(e).Box({}) as never)
  await $.session.start(START)
  await $.turn.complete(TURN)
  await clock.advance(30_000)
  expect(seen.submitted).toEqual([])
  expect(seen.registered).toEqual([])
  const band = await $.ui.mount({ plugin: 'next-steps-autopilot', surface: 'terminal', component: 'AbovePrompt', props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 120, scroll: { offset: 0, bodyRows: 10 }, view: {} } } as never)
  expect(await band.find({ text: /Run the tests/ })).toBeDefined()
  expect(await band.find({ text: /Commit/ })).toBeDefined()
})

test('a subagent turn starts no suggestion', async ($, on) => {
  const { seen, clock } = host(on)
  await $.session.start(START)
  await $.turn.complete({ ...TURN, agentId: 'sub1' } as never)
  await clock.advance(30_000)
  expect(seen.forks).toBe(0)
  expect(seen.submitted).toEqual([])
})

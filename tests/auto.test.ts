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
const host = (on: On) => {
  const seen = { submitted: [] as string[], toasts: [] as string[] }
  const clock = mock.clock(on)
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('command.register', (_, e) => ({ value: { command: e.name } }) as never)
  on('command.list', () => ({ value: [] }))
  on('model.fork', () => ({ value: { isAnswered: true, text: FORK, usage: {} } }) as never)
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

type Engine = Parameters<Parameters<typeof test>[1]>[0]
const auto = ($: Engine, args: string) =>
  $.command.run({ command: 'auto', args, origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 120 } })

test('off: suggestions are only offered, nothing is sent', async ($, on) => {
  const { seen, clock } = host(on)
  await $.session.start(START)
  await $.turn.complete(TURN)
  await clock.advance(30_000)
  expect(seen.submitted).toEqual([])
})

test('on: suggestion 1 is sent after the 10s countdown', async ($, on) => {
  const { seen, clock } = host(on)
  await $.session.start(START)
  expect((await auto($, 'on')).text).toContain('Auto mode on')
  await $.turn.complete(TURN)
  await clock.advance(9_000)
  expect(seen.submitted).toEqual([])
  await clock.advance(1_000)
  expect(seen.submitted).toEqual(['run the tests'])
})

test('a subagent turn starts no suggestion and sends nothing', async ($, on) => {
  const { seen, clock } = host(on)
  await $.session.start(START)
  await auto($, 'on')
  await $.turn.complete({ ...TURN, agentId: 'sub1' } as never)
  await clock.advance(30_000)
  expect(seen.submitted).toEqual([])
})

test('a prompt the person types cancels the countdown', async ($, on) => {
  const { seen, clock } = host(on)
  await $.session.start(START)
  await auto($, 'on')
  await $.turn.complete(TURN)
  await clock.advance(3_000)
  await $.prompt.submit({ text: 'no, do this instead', wait: false, origin: { kind: 'composer' } })
  await clock.advance(30_000)
  expect(seen.submitted).toEqual([])
})

test('stops after 10 auto turns in a row', async ($, on) => {
  const { seen, clock } = host(on)
  await $.session.start(START)
  await auto($, 'on')
  for (let i = 0; i < 11; i++) {
    await $.turn.complete({ ...TURN, turnId: `t${i}` })
    await clock.advance(10_000)
  }
  expect(seen.submitted).toHaveLength(10)
  expect(seen.toasts.some(t => t.includes('auto paused'))).toBe(true)
})

test('instant: suggestion 1 is sent with no countdown', async ($, on) => {
  const { seen, clock } = host(on)
  await $.session.start(START)
  expect((await auto($, 'instant')).text).toContain('no countdown')
  await $.turn.complete(TURN)
  await clock.advance(0)
  expect(seen.submitted).toEqual(['run the tests'])
})

test('a new session starts with auto off, even after it was on', async ($, on) => {
  const { seen, clock } = host(on)
  await $.session.start(START)
  await auto($, 'on')
  await $.session.start(START)
  await $.turn.complete(TURN)
  await clock.advance(30_000)
  expect(seen.submitted).toEqual([])
})

test('the end of a session cancels a running countdown', async ($, on) => {
  const { seen, clock } = host(on)
  on('session.end', (_, e) => ({ sessionId: e.sessionId }) as never)
  await $.session.start(START)
  await auto($, 'on')
  await $.turn.complete(TURN)
  await clock.advance(3_000)
  await $.session.end({ reason: 'other', sessionId: 's', resume: {} } as never)
  await clock.advance(30_000)
  expect(seen.submitted).toEqual([])
})

test('typing in the prompt box cancels the countdown', async ($, on) => {
  const { seen, clock } = host(on)
  on('prompt.edit', (_, e) => ({ text: e.text, cursor: e.cursor }) as never)
  await $.session.start(START)
  await auto($, 'on')
  await $.turn.complete(TURN)
  await clock.advance(3_000)
  await $.prompt.edit({ origin: { kind: 'composer' }, text: '', cursor: 0, start: 0, end: 0, reason: 'other' } as never)
  await clock.advance(30_000)
  expect(seen.submitted).toEqual([])
})

test('a draft already in the prompt box is never overwritten by a send', async ($, on) => {
  const { seen, clock } = host(on)
  on('prompt.read', () => ({ value: { text: 'half a thought', cursor: 14 } }) as never)
  await $.session.start(START)
  await auto($, 'on')
  await $.turn.complete(TURN)
  await clock.advance(30_000)
  expect(seen.submitted).toEqual([])
})

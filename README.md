# next-steps-autopilot

After each reply, Claude Code shows two or three prompts you might type next, above the prompt box. An optional `/auto` mode can send the first one for you.

> **Warning: autopilot sends messages for you without asking.** In a real case it approved and merged code changes that nobody had approved. Keep it off in any session that can push code, merge, deploy, delete things or spend money. It is off at the start of every session and only turns on when you type `/auto`.

## Why you might want it

You ask Claude to fix a bug. When it finishes, the suggestions might read "Run the tests", "Commit the fix". Press `1` and that prompt is typed into the box for you to check and send. Or press Tab to take the greyed-out first suggestion. With `/auto` on, the first suggestion is sent after a 10 second countdown, which is handy for long, low-risk chores such as "keep going until the tests pass".

## Install

```
claude plugin marketplace add varunmoka7/next-steps-autopilot
claude plugin install next-steps-autopilot@next-steps-autopilot
```

Needs Claude Code 2.1.287 or newer with mods enabled. Tested on macOS in the terminal. Other systems and the desktop or IDE apps are untested.

## How to use

- Suggestions appear by themselves after a reply of 80 characters or more. Press `1`, `2` or `3` (with an empty prompt box) to put that suggestion in the box. Edit it, then press Enter.
- `0` dismisses the suggestions.
- Tab takes the greyed-out first suggestion in the prompt box.
- `/auto` turns autopilot on or off.
- `/auto on` turns it on with a 10 second countdown. Press `0` or start typing to stop that countdown.
- `/auto instant` turns it on with no countdown. Use with great care.
- `/auto off` turns it off.

Autopilot stops after 10 turns in a row and says so. It also stops when you send a message yourself, type anything in the prompt box, or end the session. If the box already has text in it, nothing is sent.

## What it touches

- Network: none of its own. Suggestions use your normal Claude connection.
- Files: none read or written. It keeps its state in memory only.
- Model calls: one short extra request after each reply of 80 characters or more in the main conversation (not from helper agents). **This happens even when autopilot is off**, because that is how suggestions are made. The request goes to the same model your session is using and reuses the conversation Claude already has cached, so it costs about one short reply of output plus the cached read of your conversation. On a long conversation, or after the cache has expired, the read can cost more. To avoid it, turn the mod off (below).
- The request lists your skills and slash commands so a suggestion can be one of them. You can switch that off with the "Suggest skills and slash commands" option.
- Autopilot is off by default and off again at the start of every session.

## Turn it off / uninstall

- Stop autopilot: `/auto off`.
- Stop everything (no suggestions, no extra requests): `claude plugin disable next-steps-autopilot`.
- Remove it: `claude plugin uninstall next-steps-autopilot`.

## Known limits

- Suggestions are the model's guess and are sometimes wrong or empty.
- Autopilot always sends suggestion 1. It cannot tell whether that step is safe.
- Not every Claude Code screen shows the suggestions; terminal only was tested.

## License

MIT. Built on [next-steps](https://github.com/hamzafer/claude-code-mods) by hamzafer (Hamza Zafar); his copyright is kept in LICENSE. The `/auto` mode and fixes are by Varun Moka.

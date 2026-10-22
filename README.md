<p align="center">
  <img src="assets/banner.svg" alt="next-steps-autopilot: Suggested next prompts above the prompt box." width="100%">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/github/license/moka-apps/next-steps-autopilot?style=flat-square&color=111111" alt="License"></a>
  <a href="https://github.com/moka-apps"><img src="https://img.shields.io/badge/moka--apps-Claude_Code_mod-bc8cff?style=flat-square" alt="moka-apps, Claude Code mod"></a>
</p>

---

After most replies, a "What next?" button appears above the prompt box. Press it and Claude Code shows up to three prompts you might type next. You pick one, check it and press Enter. Nothing is sent for you unless you turn on `/auto`.

Version 0.5.0 stopped asking the model after every reply. The model is only asked when you press "What next?".

Version 0.6.0 brings back `/auto`, which 0.4.0 removed after it once merged code changes nobody had approved. It now holds any suggestion that mentions merge, push, delete, deploy, force, reset, drop, rm, publish or release, and the countdown length is yours to set.

## Why you might want it

You ask Claude to fix a bug. When it finishes, press `1` for "What next?" and the suggestions might read "Run the tests", "Commit the fix". Press `1` and that prompt is typed into the box for you to check and send. Or press Tab to take the greyed-out first suggestion.

## Install

Type these two lines in a terminal (the app where you start Claude Code), not inside Claude Code:

```
claude plugin marketplace add moka-apps/next-steps-autopilot
claude plugin install next-steps-autopilot@next-steps-autopilot
```

Needs Claude Code 2.1.287 or newer (mods are on by default from that version). Tested on macOS in the terminal. Other systems, the desktop app and code editor plug-ins are untested.

## How to use

- After a reply of 80 characters or more, "What next?" appears. Press `1` (with an empty prompt box) or click it to ask for suggestions.
- Press `1`, `2` or `3` (with an empty prompt box) to put that suggestion in the box. Edit it, then press Enter.
- `0` dismisses the suggestions.
- Tab takes the greyed-out first suggestion in the prompt box.

## Auto mode

Off at the start of every session.

- `/auto` or `/auto on`: after each reply, suggestions are asked for at once and suggestion 1 is sent after the countdown (10 seconds unless you changed the "Auto mode countdown" option).
- `/auto 5`: turn it on with a 5 second countdown for this session. Any whole number up to 999 works.
- `/auto 0` or `/auto instant`: send at once, no countdown. The next plain `/auto` goes back to a countdown.
- `/auto off`: stop.
- Press `0` or start typing to stop a countdown. A prompt you send yourself resets the run.
- It stops after 10 sends in a row until you send something yourself.
- A suggestion that mentions merge, push, delete, deploy, force, reset, drop, rm, publish or release is never sent by itself; it stays on screen for you to press.

## What it touches

- Network: none of its own. Suggestions use your normal Claude connection.
- Files: none read or written. It keeps its state in memory only.
- Extra AI requests: one short extra request each time you press "What next?", or after every reply while `/auto` is on, and none otherwise. The request goes to the same model your session is using and reuses the conversation Claude already has, so it costs about one short reply plus a cheap re-read of your conversation. On a long conversation, or after Claude has forgotten the saved copy of it (which happens after a few minutes), the re-read can cost more. To avoid it, don't press the button.
- The request lists your skills and your commands that start with / so a suggestion can be one of them. You can switch that off with the "Suggest skills and slash commands" option.

## Turn it off / uninstall

- Stop everything (no button, no suggestions): `claude plugin disable next-steps-autopilot`.
- Remove it: `claude plugin uninstall next-steps-autopilot`.

## Known limits

- Suggestions are the model's guess and are sometimes wrong or empty.
- Not every Claude Code screen shows the suggestions; terminal only was tested.

## License

MIT. Built on [next-steps](https://github.com/anthropics/claude-plugins-community) by Thariq Shihipar, from the Claude Code community plugins; his copyright is kept in LICENSE. Fixes by Varun Moka.

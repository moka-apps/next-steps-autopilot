# next-steps-autopilot

After most replies, Claude Code may show up to three prompts you might type next, above the prompt box. It never sends anything for you: you pick one, check it and press Enter.

Version 0.4.0 removed the old `/auto` mode, which sent the first suggestion by itself. In the author's own use it once merged code changes that nobody had approved.

## Why you might want it

You ask Claude to fix a bug. When it finishes, the suggestions might read "Run the tests", "Commit the fix". Press `1` and that prompt is typed into the box for you to check and send. Or press Tab to take the greyed-out first suggestion.

## Install

Type these two lines in a terminal (the app where you start Claude Code), not inside Claude Code:

```
claude plugin marketplace add varunmoka7/next-steps-autopilot
claude plugin install next-steps-autopilot@next-steps-autopilot
```

Needs Claude Code 2.1.287 or newer (mods are on by default from that version). Tested on macOS in the terminal. Other systems, the desktop app and code editor plug-ins are untested.

## How to use

- Suggestions appear by themselves after a reply of 80 characters or more. Press `1`, `2` or `3` (with an empty prompt box) to put that suggestion in the box. Edit it, then press Enter.
- `0` dismisses the suggestions.
- Tab takes the greyed-out first suggestion in the prompt box.

## What it touches

- Network: none of its own. Suggestions use your normal Claude connection.
- Files: none read or written. It keeps its state in memory only.
- Extra AI requests: one short extra request after each reply of 80 characters or more in the main conversation (not from helper agents). That is how suggestions are made. The request goes to the same model your session is using and reuses the conversation Claude already has, so it costs about one short reply plus a cheap re-read of your conversation. On a long conversation, or after Claude has forgotten the saved copy of it (which happens after a few minutes), the re-read can cost more. To avoid it, turn the mod off (below).
- The request lists your skills and your commands that start with / so a suggestion can be one of them. You can switch that off with the "Suggest skills and slash commands" option.

## Turn it off / uninstall

- Stop everything (no suggestions, no extra requests): `claude plugin disable next-steps-autopilot`.
- Remove it: `claude plugin uninstall next-steps-autopilot`.

## Known limits

- Suggestions are the model's guess and are sometimes wrong or empty.
- Not every Claude Code screen shows the suggestions; terminal only was tested.

## License

MIT. Built on [next-steps](https://github.com/anthropics/claude-plugins-community) by Thariq Shihipar, from the Claude Code community plugins; his copyright is kept in LICENSE. Fixes by Varun Moka.

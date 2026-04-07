# Hermes + WebUI — Pinokio Launcher

One-click Pinokio launcher that installs and runs
**[Hermes Agent](https://github.com/NousResearch/hermes-agent)** with the
**[Hermes Web UI](https://github.com/nesquena/hermes-webui)** front-end.

Both upstream repos are cloned unmodified so you get every update automatically
via the **Update** button. This launcher is intentionally thin — all
functionality lives in the upstream projects.

---

## Requirements

| | Minimum |
|---|---|
| RAM | 4 GB |
| Python | 3.11+ (managed by Pinokio/uv — nothing to install manually) |
| API key | At least one: OpenAI, Anthropic, Google, DeepSeek, OpenRouter, etc. |
| OS | macOS, Linux, or Windows (via Pinokio's bash environment) |

---

## What this installs

```
app/
├── hermes-agent/   ← NousResearch/hermes-agent  (autonomous AI agent)
├── hermes-webui/   ← nesquena/hermes-webui       (browser UI)
└── env/            ← shared Python 3.11 venv
```

Both repos are cloned from their canonical GitHub locations — nothing is forked
or patched.

---

## Getting started

1. Click **Install** in Pinokio.
2. Once done, click **Start**.
3. The **Open Hermes WebUI** button appears when the server is ready — click it.
4. In the web UI, open **Settings** (gear icon) and add your API key for your
   preferred provider (OpenAI, Anthropic, etc.).
5. Start chatting.

Hermes remembers you across sessions. The longer it runs, the more context it
accumulates.

---

## Buttons

| Button | What it does |
|---|---|
| **Start** | Launches the Web UI server on a free local port |
| **Open Hermes WebUI** | Opens the chat interface in a Pinokio popup |
| **Update** | Pulls latest code for the launcher + both upstream repos |
| **Install** | Runs the full install (use after Reset, or first time) |
| **Reset** | Removes `app/` and the venv; your Hermes memory at `~/.hermes` is **not** touched |

---

## Where state lives

Hermes stores sessions, memory, skills, and config in `~/.hermes/` on your
machine — completely outside this launcher. Resetting or reinstalling this
Pinokio app has **no effect** on your agent's memory or configuration.

---

## Configuration

After first start, run `hermes setup` in a terminal (from `app/hermes-agent`
with the venv active) to configure API keys, model provider, and messaging
integrations. Alternatively, configure everything via the **Settings** panel
inside the Web UI.

Environment variables you can set before starting:

| Variable | Default | Description |
|---|---|---|
| `HERMES_WEBUI_HOST` | `127.0.0.1` | Bind address |
| `HERMES_WEBUI_STATE_DIR` | `~/.hermes/webui` | Where sessions are stored |
| `HERMES_WEBUI_DEFAULT_WORKSPACE` | `~/workspace` | Default file workspace |
| `HERMES_WEBUI_PASSWORD` | *(unset)* | Enable password auth |
| `HERMES_HOME` | `~/.hermes` | Hermes base directory |

---

## API access

The Web UI exposes a small REST + SSE API at `http://127.0.0.1:<PORT>`.

### Health check

```bash
curl http://127.0.0.1:8787/health
```

### List sessions (JavaScript)

```javascript
const res = await fetch('http://127.0.0.1:8787/sessions')
const { sessions } = await res.json()
console.log(sessions)
```

### List sessions (Python)

```python
import requests
sessions = requests.get('http://127.0.0.1:8787/sessions').json()['sessions']
print(sessions)
```

See [ARCHITECTURE.md](https://github.com/nesquena/hermes-webui/blob/master/ARCHITECTURE.md)
in the hermes-webui repo for the full API endpoint reference.

---

## Links

- [Hermes Agent repo](https://github.com/NousResearch/hermes-agent)
- [Hermes Web UI repo](https://github.com/nesquena/hermes-webui)
- [Hermes documentation](https://hermes-agent.nousresearch.com/docs/)
- [Nous Research](https://nousresearch.com/)

---

MIT — launcher scripts by [Ramshi / neviah](https://github.com/neviah).
Hermes Agent © Nous Research (MIT). Hermes Web UI © nesquena (MIT).

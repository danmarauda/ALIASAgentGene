module.exports = {
  run: [
    // Clone both upstream repos (upstream-friendly: never patched)
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/NousResearch/hermes-agent app/hermes-agent",
          "git clone https://github.com/nesquena/hermes-webui app/hermes-webui"
        ]
      }
    },

    // Build a shared Python 3.11 venv and install both projects into it.
    // hermes-agent is installed in editable mode so `git pull` in update.js
    // picks up changes without a reinstall step.
    {
      method: "shell.run",
      params: {
        venv: "env",
        venv_python: "3.11",
        path: "app",
        message: [
          "uv pip install -e \"./hermes-agent[cron,pty,mcp]\"",
          "uv pip install -r ./hermes-webui/requirements.txt"
        ]
      }
    }
  ]
}

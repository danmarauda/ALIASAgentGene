// Bootstrap: pull latest launcher code, then update both upstream repos
// and refresh the venv so new dependencies are picked up automatically.
module.exports = {
  run: [
    // Update this launcher repo
    {
      method: "shell.run",
      params: {
        message: "git pull"
      }
    },

    // Update hermes-agent (editable install: no reinstall needed for code changes,
    // but we reinstall anyway in case the dependency set changed)
    {
      method: "shell.run",
      params: {
        path: "app/hermes-agent",
        message: "git pull"
      }
    },

    // Update hermes-webui
    {
      method: "shell.run",
      params: {
        path: "app/hermes-webui",
        message: "git pull"
      }
    },

    // Refresh Hermes agent's Node/browser dependencies too. The browser tools
    // depend on the local agent-browser CLI and its managed Chromium install.
    {
      method: "shell.run",
      params: {
        path: "app/hermes-agent",
        message: [
          "npm install",
          "npx agent-browser install"
        ]
      }
    },

    // Refresh dependencies in case requirements changed upstream
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install -e \"./hermes-agent[cron,pty,mcp]\"",
          "uv pip install -r ./hermes-webui/requirements.txt"
        ]
      }
    }
  ]
}

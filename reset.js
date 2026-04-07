module.exports = {
  run: [
    {
      method: "fs.rm",
      params: {
        path: "app/hermes-agent"
      }
    },
    {
      method: "fs.rm",
      params: {
        path: "app/hermes-webui"
      }
    },
    {
      method: "fs.rm",
      params: {
        path: "app/env"
      }
    }
  ]
}

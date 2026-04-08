const fs = require('fs')
const path = require('path')

function applyLocalRoutingPatch(configPath) {
  if (!fs.existsSync(configPath)) {
    console.log(`[patch] Skipped: file not found: ${configPath}`)
    return true
  }

  const original = fs.readFileSync(configPath, 'utf8')

  // Already patched, nothing to do.
  if (original.includes('PATCH: keep custom base_url routing for provider/model IDs')) {
    console.log('[patch] Already applied: local routing guard present')
    return true
  }

  const oldBlock = [
    '        # If prefix does NOT match config provider, the user picked a cross-provider model',
    '        # from the OpenRouter dropdown (e.g. config=anthropic but picked openai/gpt-5.4-mini).',
    '        # In this case always route through openrouter with the full provider/model string.',
    '        if prefix in _PROVIDER_MODELS and prefix != config_provider:',
    "            return model_id, 'openrouter', None",
  ].join('\n')

  const newBlock = [
    '        # If prefix does NOT match config provider, the user picked a cross-provider model',
    '        # from the OpenRouter dropdown (e.g. config=anthropic but picked openai/gpt-5.4-mini).',
    '        # In this case always route through openrouter with the full provider/model string.',
    '        # PATCH: keep custom base_url routing for provider/model IDs when provider is not fixed.',
    '        # This allows local endpoints (LM Studio/Ollama/custom) to use model IDs like',
    '        # google/gemma-4-26b-a4b without being forced to OpenRouter.',
    '        if prefix in _PROVIDER_MODELS and prefix != config_provider and not config_base_url:',
    "            return model_id, 'openrouter', None",
  ].join('\n')

  if (!original.includes(oldBlock)) {
    console.log('[patch] WARNING: target block not found, upstream changed. No patch applied.')
    return true
  }

  const updated = original.replace(oldBlock, newBlock)
  fs.writeFileSync(configPath, updated, 'utf8')
  console.log('[patch] Applied: local base_url no longer forced to OpenRouter routing')
  return true
}

function main() {
  const configPath = path.join(__dirname, 'app', 'hermes-webui', 'api', 'config.py')
  applyLocalRoutingPatch(configPath)
}

main()
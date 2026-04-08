const fs = require('fs')
const path = require('path')

function applyLocalRoutingPatch(configPath) {
  if (!fs.existsSync(configPath)) {
    console.log(`[patch] Skipped: file not found: ${configPath}`)
    return true
  }

  const original = fs.readFileSync(configPath, 'utf8')

  // Already patched, nothing to do.
  if (original.includes('prefix in _PROVIDER_MODELS and prefix != config_provider and not config_base_url')) {
    console.log('[patch] Already applied: local routing guard present')
    return true
  }

  const targetRe = /(^\s*)if prefix in _PROVIDER_MODELS and prefix != config_provider:\s*\r?\n\1\s+return model_id, 'openrouter', None/m
  const match = original.match(targetRe)
  if (!match) {
    console.log('[patch] WARNING: target block not found, upstream changed. No patch applied.')
    return true
  }

  const indent = match[1] || '        '
  const replacement = [
    `${indent}# PATCH: keep custom base_url routing for provider/model IDs when provider is not fixed.`,
    `${indent}# This allows local endpoints (LM Studio/Ollama/custom) to use model IDs like`,
    `${indent}# google/gemma-4-26b-a4b without being forced to OpenRouter.`,
    `${indent}if prefix in _PROVIDER_MODELS and prefix != config_provider and not config_base_url:`,
    `${indent}    return model_id, 'openrouter', None`,
  ].join('\n')

  const updated = original.replace(targetRe, replacement)
  fs.writeFileSync(configPath, updated, 'utf8')
  console.log('[patch] Applied: local base_url no longer forced to OpenRouter routing')
  return true
}

function main() {
  const configPath = path.join(__dirname, 'app', 'hermes-webui', 'api', 'config.py')
  applyLocalRoutingPatch(configPath)
}

main()
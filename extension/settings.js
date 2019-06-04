chrome.storage.local.get([
  'currentMode',
  'currentModeId',
  'options',
  'proxies',
], ({
  currentMode,
  currentModeId,
  options,
  proxies,
}) => {
  if (!currentMode)
    chrome.storage.local.set({ currentMode: undefined }, () => {})

  if (!currentModeId)
    chrome.storage.local.set({ currentModeId: undefined }, () => {})

  if (!options)
    chrome.storage.local.set({ options: {} }, () => {})

  if (!proxies)
    chrome.storage.local.set({ proxies: [] }, () => {})
})

chrome.storage.local.get(['options', 'proxies'], ({ options, proxies }) => {
  if (!options) chrome.storage.local.set({ options: {} }, () => {})
  if (!proxies) chrome.storage.local.set({ proxies: [] }, () => {})
})

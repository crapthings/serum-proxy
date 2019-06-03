chrome.storage.local.get(['options', 'proxies', 'urls'], ({ options, proxies, urls }) => {
  if (!options) chrome.storage.local.set({ options: {} }, () => {})
  if (!proxies) chrome.storage.local.set({ proxies: [] }, () => {})
  chrome.storage.local.set({ urls: {} }, () => {})
})

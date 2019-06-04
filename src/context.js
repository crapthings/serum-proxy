app = observable({
  currentMode: undefined,
  currentModeId: undefined,
  options: {},
  proxies: [],
})

chrome.storage.local.get([
  'currentMode',
  'currentModeId',
  'options',
  'proxies',
], result => {
  mobx.set(app, result)
})

chrome.proxy.settings.get({} , ({ value: { mode: currentMode } }) => {
  chrome.storage.local.set({ currentMode }, () => {})
})

chrome.proxy.settings.onChange.addListener(({ value: { mode: currentMode } }) => {
  chrome.storage.local.set({ currentMode }, () => {})
})

chrome.storage.onChanged.addListener(function (result) {
  const _result = _.mapValues(result, ({ newValue }) => newValue)
  mobx.set(app, _result)
})

chrome.proxy.onProxyError.addListener(function (details) {
  console.log(details)
})

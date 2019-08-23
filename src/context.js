app = observable({
  loading: true,
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
  result.loading = false
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

require('./global')
require('./routes')

chrome.proxy.onProxyError.addListener(function (details) {
  console.log(details.error)
})

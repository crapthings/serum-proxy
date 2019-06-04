chrome.webRequest.onBeforeRequest.addListener(function (details) {
  console.log('onBeforeRequest', details)
}, { urls: ['<all_urls>'] })

chrome.webRequest.onCompleted.addListener(function (details) {
  console.log('onCompleted', details)
}, { urls: ['<all_urls>'] })

chrome.proxy.onProxyError.addListener(function (details) {
  console.log(details)
})

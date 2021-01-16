chrome.webRequest.onBeforeRequest.addListener(function (details) {
  console.log('onBeforeRequest', details?.initiator)
}, { urls: ['<all_urls>'] })

chrome.webRequest.onCompleted.addListener(function (details) {
  console.log('onCompleted', details?.initiator)
}, { urls: ['<all_urls>'] })

chrome.webRequest.onErrorOccurred.addListener(function (details) {
  console.log('onErrorOccurred', details)
}, { urls: ['<all_urls>'] })

chrome.proxy.onProxyError.addListener(function (details) {
  console.log('onProxyError', details)
})

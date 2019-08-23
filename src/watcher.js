chrome.webRequest.onBeforeRequest.addListener(function (details) {
  console.log(details)
}, { urls: ['<all_urls>'] })

chrome.webRequest.onCompleted.addListener(function (details) {
}, { urls: ['<all_urls>'] })

chrome.proxy.onProxyError.addListener(function (details) {
  console.log(details)
})

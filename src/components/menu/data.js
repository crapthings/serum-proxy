module.exports = `
  var FindProxyForURL = function (url, host) {
    if (
      dnsDomainIs(host, "youtube.com") ||
      dnsDomainIs(host, "google.com")
    ) {
      return "SOCKS5 127.0.0.1:1080"
    }

    return "DIRECT"
  }
`

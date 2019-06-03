module.exports = ({ host, port, urls }) => `
  const list = urls

  function FindProxyForURL (url, host) {
    const _host = getHostname(host)

    if (list[_host]) {
      return "SOCKS5 ${host}:${port}"
    }

    return "DIRECT"
  }

  function getHostname(hostname) {
    let _hostname = hostname.split('.')

    if (_hostname.length > 2) {
      const [first, ...rest] = _hostname
      _hostname = rest
    }

    return _hostname.join('.')
  }
`

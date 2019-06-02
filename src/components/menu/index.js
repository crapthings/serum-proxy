const data = 'function FindProxyForURL(url, host) { return "DIRECT" }'

export default class GetOptions extends Component {
  state = {
    loading: true,
    currentMode: undefined,
    host: undefined,
    port: undefined,
  }

  async componentDidMount() {
    const actions = [this.getCurrentMode(), this.getHostPort()]
    const [currentMode, { port, host }] = await Promise.all(actions)
    this.setState({ loading: false, currentMode, port, host })
  }

  render() {
    const { loading, currentMode, host, port } = this.state

    return loading
      ? <div className='pd'>loading</div>
      : <Menu data={{ currentMode, host, port }} />
  }

  getCurrentMode = () => new Promise(resolve => {
    chrome.proxy.settings.get({}, ({ value: { mode: currentMode } }) => {
      resolve(currentMode)
    })
  })

  getHostPort = () => new Promise(resolve => {
    chrome.storage.sync.get(['host', 'port'], ({ host, port }) => {
      resolve({ host, port })
    })
  })
}


class Menu extends Component {
  state = {
    currentMode: this.props.data.currentMode,
    host: this.props.data.host,
    port: this.props.data.port,
  }

  render() {
    const { currentMode } = this.state

    const menu = [
      { text: 'Direct', mode: 'direct', onClick: this.useDirect },
      { text: 'PAC', mode: 'pac_script', onClick: this.usePac },
      { text: 'Proxy', mode: 'fixed_servers', onClick: this.useProxy },
      { text: 'Options', mode: 'none', onClick: this.openOptions },
    ]

    return (
      <div className='flex-column' id='menu'>
        {menu.map(({ text, mode, onClick }, itemIdx) => (
          <div key={`menu-item-${itemIdx}`} className='flex pd menu-item' onClick={onClick}>
            <span className='flex-1'>{text}</span>
            {currentMode === mode && <span>●</span>}
          </div>
        ))}
      </div>
    )
  }

  reloadCurrentTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.reload(tabs[0].id)
    })
  }

  useDirect = () => {
    const value = {
      mode: 'direct',
    }

    chrome.proxy.settings.set({ value }, () => {
      this.setState({ currentMode: value.mode }, () => {
        this.reloadCurrentTab()
      })
    })
  }

  usePac = () => {
    const value = {
      mode: 'pac_script',
      pacScript: {
        // url: 'https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt',
        data,
      }
    }

    chrome.proxy.settings.set({ value }, () => {
      this.setState({ currentMode: value.mode }, () => {
        this.reloadCurrentTab()
      })
    })
  }

  useProxy = () => {
    const { host, port } = this.props.data

    if (_.isEmpty(host) && _.isEmpty(port))
      return this.openOptions()

    const proxy = {
      scheme: 'socks5',
      host,
      port,
    }

    const value = {
      mode: 'fixed_servers',
      rules: {
        bypassList: [],
        proxyForHttp: proxy,
        proxyForHttps: proxy,
      },
    }

    chrome.proxy.settings.set({ value }, () => {
      this.setState({ currentMode: value.mode }, () => {
        this.reloadCurrentTab()
      })
    })
  }

  openOptions = () => {
    const url = chrome.extension.getURL('options.html')

    chrome.tabs.query({ url }, tabs => {
      if (tabs.length) {
        chrome.tabs.update(tabs[0].id, { active: true })
      } else {
        chrome.tabs.create({ url })
      }
    })
  }
}

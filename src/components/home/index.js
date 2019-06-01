export default class Comp extends Component {
  state = {
    currentMode: undefined,
  }

  componentDidMount() {
    chrome.proxy.settings.get({}, ({ value: { mode: currentMode } }) => {
      this.setState({ currentMode })
    })
  }

  render() {
    const { currentMode } = this.state

    console.log(currentMode)

    const menu = [
      { text: 'Direct', mode: 'direct', onClick: this.useDirect },
      { text: 'Proxy', mode: 'fixed_servers', onClick: this.useProxy },
    ]

    return (
      <div className='flex-column' id='menu'>
        {menu.map(({ text, mode, onClick }, itemIdx) => (
          <div key={`menu-item-${itemIdx}`} className='flex pd menu-item' onClick={onClick}>
            <span className='flex-1'>{text}</span>
            {currentMode == mode && <span>●</span>}
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

  useProxy = () => {
    const proxy = {
      scheme: 'socks5',
      host: '127.0.0.1',
      port: 1080,
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
}

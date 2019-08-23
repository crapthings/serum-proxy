@observer
export default class Menu extends Component {
  render() {
    const { loading } = app

    if (loading) {
      return (
        <div>loading</div>
      )
    }

    const menu = [
      { id: 'direct', name: 'Direct', mode: 'direct' },
      { id: 'system', name: 'System', mode: 'system' },
      { id: 'settings', name: 'Settings', mode: 'settings' },
    ]

    const { currentModeId, proxies } = app

    const _menu = [menu[0], ...proxies, menu[1], menu[2]]

    return (
      <div className='flex-column' id='menu'>
        {_menu.map((item, itemIdx) => (
          <div key={`menu-item-${item.id}`} className='flex pd menu-item' onClick={this.onClick(item)}>
            <span className='flex-1'>{item.name}</span>
            {currentModeId === item.id && <span style={{ color: 'lightgreen' }}>●</span>}
          </div>
        ))}
      </div>
    )
  }

  reloadCurrentTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.reload(tabs[0].id)
      window.close()
    })
  }

  onClick = ({ id, name, host, port, mode }) => evt => {
    if (mode === 'direct' || mode === 'system') {
      return this.useMode({ id, mode })
    }

    if (mode === 'fixed_servers')
      return this.useProxy({ id, name, host, port, mode })

    if (mode === 'pac_script')
      return this.usePac({ id, name, host, port, mode })

    if (mode === 'settings')
      return this.openTab('settings.html')
  }

  useMode = ({ id: currentModeId, mode }) => {
    chrome.proxy.settings.set({ value: { mode } }, () => {
      chrome.storage.local.set({ currentModeId }, () => {
        this.reloadCurrentTab()
      })
    })
  }

  useProxy = ({ id: currentModeId, name, host, port, mode }) => {
    const bypassList = (app.options.bypassList && mobx.toJS(app.options.bypassList) || [])

    const proxy = {
      scheme: 'socks5',
      host,
      port,
    }

    const value = {
      mode,
      rules: {
        bypassList,
        proxyForHttp: proxy,
        proxyForHttps: proxy,
      },
    }

    chrome.proxy.settings.set({ value }, () => {
      chrome.storage.local.set({ currentModeId }, () => {
        this.reloadCurrentTab()
      })
    })
  }

  usePac = ({ id: currentModeId, host, port }) => {
    chrome.storage.local.get(['urls'], ({ urls }) => {
      alert(urls)
      const value = {
        mode: 'pac_script',
        pacScript: {
          // data: require('./data')({ host, port, urls }),
        }
      }

      chrome.proxy.settings.set({ value }, () => {
        chrome.storage.local.set({ currentModeId }, () => {
          this.reloadCurrentTab()
        })
      })
    })
  }

  openTab = file => {
    const url = chrome.extension.getURL(file)

    chrome.tabs.query({ url }, tabs => {
      if (tabs.length) {
        chrome.tabs.update(tabs[0].id, { active: true })
        window.close()
      } else {
        chrome.tabs.create({ url })
        window.close()
      }
    })
  }
}

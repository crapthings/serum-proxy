import { GetSettingsHOC } from '../common'

var pac = require('./data')

export default class Menu extends Component {
  render() {
    const menu = [
      { name: 'Direct', mode: 'direct' },
      { name: 'System', mode: 'system' },
      { name: 'Settings', mode: 'settings' },
    ]

    return (
      <GetSettingsHOC>
        {({ currentMode, options, proxies }) => {
          const _menu = [menu[0], ...proxies, menu[1], menu[2]]
          return (
            <div className='flex-column' id='menu'>
              {_menu.map((item, itemIdx) => (
                <div key={`menu-item-${itemIdx}`} className='flex pd menu-item' onClick={this.onClick(item)}>
                  <span className='flex-1'>{item.name}</span>
                  {currentMode === item.mode && <span style={{ color: 'lightgreen' }}>●</span>}
                </div>
              ))}
            </div>
          )
        }}
      </GetSettingsHOC>
    )
  }

  reloadCurrentTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.reload(tabs[0].id)
      window.close()
    })
  }

  onClick = ({ name, host, port, mode }) => evt => {
    if (mode === 'direct' || mode === 'system') {
      return this.useMode(mode)
    }

    if (mode === 'fixed_servers')
      return this.useProxy({ name, host, port, mode })

    if (mode === 'settings')
      return this.openSettings()
  }

  useMode = mode => {
    return chrome.proxy.settings.set({ value: { mode } }, () => {
      this.reloadCurrentTab()
    })
  }

  useProxy = ({ name, host, port, mode }) => {
    const proxy = {
      scheme: 'socks5',
      host,
      port,
    }

    const value = {
      mode,
      rules: {
        bypassList: [],
        proxyForHttp: proxy,
        proxyForHttps: proxy,
      },
    }

    chrome.proxy.settings.set({ value }, () => {
      this.reloadCurrentTab()
    })
  }

  usePac = () => {
    const value = {
      mode: 'pac_script',
      pacScript: {
        // url: 'https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt',
        data: pac,
      }
    }

    chrome.proxy.settings.set({ value }, () => {
      this.reloadCurrentTab()
    })
  }

  openSettings = () => {
    const url = chrome.extension.getURL('settings.html')

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

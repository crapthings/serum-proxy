@observer
export default class Settings extends Component {
  render() {
    const { loading, proxies, options } = app

    if (loading) {
      return (
        <div>loading</div>
      )
    }

    const _proxies = mobx.toJS(proxies)

    return (
      <div id='settings'>
        <h3 className='mgb-2x'>Proxies</h3>
        <div className='mgb' id='proxies'>
          {_proxies.map((proxy, proxyIdx) => (
            <ProxyForm key={`proxy-form-${proxyIdx}`} proxies={_proxies} id={proxyIdx} proxy={proxy} />
          ))}
          <ProxyForm proxies={_proxies} id={proxies.length} add={true} />
        </div>

        <h3 className='mgb-2x'>Options</h3>
        <div id='options'>
          <OptionsForm options={options} />
        </div>
      </div>
    )
  }
}

class ProxyForm extends Component {
  render() {
    const { proxy: { name, host, port, mode } = {}, add } = this.props

    return (
      <form className='mgb'>
        <div className='flex flex-center mgb'>
          <div className='flex-1 mgr'>
            <label>
              <div>Name</div>
              <input type='text' defaultValue={name} onChange={this.onSubmit} required autoFocus />
            </label>
          </div>

          <div className='flex-1 mgr'>
            <label>
              <div>Host</div>
              <input type='text' defaultValue={host || '127.0.0.1'} onChange={this.onSubmit} required />
            </label>
          </div>

          <div className='flex-1 mgr'>
            <label>
              <div>Port</div>
              <input type='text' defaultValue={port || 1080} onChange={this.onSubmit} required />
            </label>
          </div>

          <div className='flex-1 mgr'>
            <label>
              <div title='fixed_servers | pac_script'>Mode</div>
              <input type='text' defaultValue={mode || 'fixed_servers'} onChange={this.onSubmit} onClick={this.toggleMode} required />
            </label>
          </div>

          {add ? <div>
            <button onClick={this.onSubmit} style={{ width: '64px' }}>Add</button>
          </div> : <div>
            <button type='button' onClick={this.remove} style={{ width: '64px' }}>Remove</button>
          </div>}
        </div>
      </form>
    )
  }

  toggleMode = evt => {
    evt.preventDefault()
  }

  onSubmit = evt => {
    evt.preventDefault()
    if (this.props.add && evt.type === 'change') return
    const { form } = evt.target
    const [input1, input2, input3, input4] = form
    const name = input1.value
    const host = input2.value
    const port = parseInt(input3.value)
    const mode = input4.value
    const { id, proxies } = this.props
    const proxy = { id, name, host, port, mode }
    _.set(proxies, id, proxy)
    chrome.storage.local.set({ proxies }, () => {
      form.reset()
    })
  }

  remove = evt => {
    const { id, proxies } = this.props
    _.pullAt(proxies, [id])
    chrome.storage.local.set({ proxies }, () => {
      if (app.currentModeId !== id) return
      chrome.proxy.settings.set({ value: { mode: 'direct' } }, () => {
        chrome.storage.local.set({ currentModeId: 'direct' }, () => {})
      })
    })
  }
}

class OptionsForm extends Component {
  render() {
    const { options } = this.props
    const bypassList = (options.bypassList || []).join('\n')
    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <label>
            <div>Bypass List</div>
            <textarea rows='100' defaultValue={bypassList} />
          </label>
        </div>
        <div style={{ textAlign: 'right' }}>
          <input type='submit' value='Save' />
        </div>
      </form>
    )
  }

  onSubmit = evt => {
    evt.preventDefault()
    const bypassList = _.chain(evt.target[0].value).split('\n').reject(_.isEmpty).value()
    const options = { bypassList }
    chrome.storage.local.set({ options }, () => {})
  }
}

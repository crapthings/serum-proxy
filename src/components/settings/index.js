import { GetSettingsHOC } from '../common'

export default class Settings extends Component {
  render() {
    return (
      <GetSettingsHOC>
        {({ options, proxies }) => (
          <div id='settings'>
            <div id='proxies'>
              {proxies.map((proxy, proxyIdx) => (
                <ProxyForm proxies={proxies} id={proxyIdx} proxy={proxy} />
              ))}
              <ProxyForm proxies={proxies} id={proxies.length} add={true} />
            </div>
          </div>
        )}
      </GetSettingsHOC>
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
              <input type='text' defaultValue={name} onChange={this.submit} required autoFocus />
            </label>
          </div>

          <div className='flex-1 mgr'>
            <label>
              <div>Host</div>
              <input type='text' defaultValue={host} onChange={this.submit} required />
            </label>
          </div>

          <div className='flex-1 mgr'>
            <label>
              <div>Port</div>
              <input type='text' defaultValue={port} onChange={this.submit} required />
            </label>
          </div>

          <div className='flex-1 mgr'>
            <label>
              <div>Mode</div>
              <input type='text' defaultValue={mode || 'fixed_servers'} onChange={this.submit} onClick={this.toggleMode} disabled required />
            </label>
          </div>

          {add ? <div>
            <button onClick={this.submit} style={{ width: '64px' }}>Add</button>
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

  submit = evt => {
    const [input1, input2, input3, input4] = evt.target.form
    const name = input1.value
    const host = input2.value
    const port = parseInt(input3.value)
    const mode = input4.value
    const { id, proxies } = this.props
    const proxy = { name, host, port, mode }
    _.set(proxies, id, proxy)
    chrome.storage.local.set({ proxies }, () => {
      console.log(proxies)
    })
  }

  remove = evt => {
    const { id, proxies } = this.props
    _.pullAt(proxies, [id])
    chrome.storage.local.set({ proxies }, () => {
      console.log(proxies)
    })
  }
}

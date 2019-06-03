export class GetSettingsHOC extends Component {
  state = {
    loading: true,
    currentMode: undefined,
    options: {},
    proxies: [],
    urls: {},
  }

  async componentDidMount() {
    const currentMode = await this.getCurrentMode()
    const { options, proxies, urls } = await this.getSettings()
    this.setState({ loading: false, currentMode, options, proxies, urls })
  }

  render() {
    const { children } = this.props
    const { loading, currentMode, options, proxies, urls } = this.state

    return loading
      ? <div className='pd'>loading</div>
      : children({ currentMode, options, proxies, urls })
  }

  getCurrentMode = () => new Promise(resolve => {
    chrome.proxy.settings.get({}, ({ value: { mode: currentMode } }) => {
      resolve(currentMode)
    })
  })

  getSettings = () => new Promise(resolve => {
    chrome.storage.local.get(['options', 'proxies', 'urls'], ({ options, proxies, urls }) => {
      resolve({ proxies, options, urls })
    })
  })
}

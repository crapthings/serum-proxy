export class GetSettingsHOC extends Component {
  state = {
    loading: true,
    currentMode: undefined,
    options: {},
    proxies: [],
  }

  async componentDidMount() {
    const currentMode = await this.getCurrentMode()
    const { options, proxies } = await this.getSettings()
    this.setState({ loading: false, currentMode, options, proxies })
  }

  render() {
    const { children } = this.props
    const { loading, currentMode, options, proxies } = this.state

    return loading
      ? <div className='pd'>loading</div>
      : children({ currentMode, options, proxies })
  }

  getCurrentMode = () => new Promise(resolve => {
    chrome.proxy.settings.get({}, ({ value: { mode: currentMode } }) => {
      resolve(currentMode)
    })
  })

  getSettings = () => new Promise(resolve => {
    chrome.storage.local.get(['options', 'proxies'], ({ options, proxies }) => {
      resolve({ proxies, options })
    })
  })
}

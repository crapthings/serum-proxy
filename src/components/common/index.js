export class GetSettingsHOC extends Component {
  state = {
    loading: true,
    currentMode: undefined,
    options: this.props.options || {},
    proxies: this.props.proxies || [],
  }

  async componentWillMount() {
    const keys = ['options', 'proxies']
    const settings = await this.getSettings(keys)
    this.setState({ loading: false, ...settings })
  }

  render() {
    return this.state.loading
      ? <div className='pd'>loading</div>
      : this.props.children(this.state)
  }

  getSettings = keys => new Promise(resolve => (
    chrome.storage.local.get(keys, resolve)
  ))
}

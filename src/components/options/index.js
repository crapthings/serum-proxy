export default class Comp extends Component {
  render() {
    return (
      <div id='options'>
        <ProxyForm />
      </div>
    )
  }
}

class ProxyForm extends Component {
  state = {
    host: undefined,
    port: undefined,
  }

  componentDidMount() {
    chrome.storage.sync.get(['host', 'port'], ({ host, port }) => {
      this.setState({ host, port })
    })
  }

  render() {
    const { host, port } = this.state

    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <div>
            <label>
              <div>host</div>
              <input type='text' defaultValue={host} required />
            </label>
          </div>

          <div>
            <label>
              <div>port</div>
              <input type='text' defaultValue={port} required />
            </label>
          </div>
        </div>

        <div>
          <input type='submit' />
        </div>
      </form>
    )
  }

  onSubmit = evt => {
    evt.preventDefault()
    const [input1, input2] = evt.target
    const host = input1.value
    const port = parseInt(input2.value)
    chrome.storage.sync.set({ host, port }, () => {
      console.log(host, port)
      console.log(host, typeof port)
    })
  }
}

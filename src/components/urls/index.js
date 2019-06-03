import { GetSettingsHOC } from '../common'

class Urls extends Component {
  render() {
    return (
      <GetSettingsHOC>
        {({ options, proxies, urls }) => (
          <div id='urls'>
            <h3 className='mgb-2x'>Urls</h3>
            <form className='mgb' onSubmit={this.onSubmit}>
              {_.map(urls, ((url, urlIdx) => (
                <div className='flex flex-center mgb'>
                  <div className='flex-1 mgr'>
                    <label>
                      <div>Domain</div>
                      <input type='text' defaultValue={urlIdx} required autoFocus />
                    </label>
                  </div>
                </div>
              )))}
              <div>
                <button>Submit</button>
              </div>
            </form>
          </div>
        )}
      </GetSettingsHOC>
    )
  }

  onSubmit = evt => {
    evt.preventDefault()
    const form = Array.from(evt.target)
    chrome.storage.local.get(['urls'], ({ urls }) => {
      const _urls = _.chain(form)
        .map('value')
        .dropRight()
        .keyBy()
        .mapValues(() => true)
        .value()
      chrome.storage.local.set({ urls: {
        ...urls,
        ..._urls,
      }}, () => {

      })
    })

  }
}

export default ({ urls, setUrls }) => route => <Urls />

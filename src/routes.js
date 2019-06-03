import { render } from 'react-dom'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom'

import { createBrowserHistory } from 'history'

import urijs from 'urijs'

import {
  Menu,
  Settings,
} from './components'

class Root extends Component {
  state = {
    urls: {}
  }

  componentWillMount() {
    chrome
      .webRequest
      .onErrorOccurred
      .addListener(this.onErrorOccurred, { urls: ['<all_urls>'] })
  }

  render() {
    const { urls } = this.state
    const setUrls = this.setUrls

    return (
      <Router history={app.route}>
        <Switch>
          <Route path='/menu.html' component={Menu({ urls, setUrls })} />
          <Route path='/settings.html' component={Settings({ urls, setUrls })} />
        </Switch>
      </Router>
    )
  }

  onErrorOccurred = details => {
    console.log(details)
    const { error, initiator, url } = details
    const { urls } = this.state
    if (error === 'net::ERR_CONNECTION_TIMED_OUT') {
      if (initiator)
        urls[this.formatUrl(initiator)] = this.formatUrl(initiator)

      urls[this.formatUrl(url)] = this.formatUrl(url)

      this.setUrls(urls)
    }
  }

  setUrls = urls => {
    this.setState({ urls }, () => {
      console.log(urls)
      chrome.browserAction.setBadgeText( { text: _.size(urls).toString() } )
      chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] })
    })
  }

  formatUrl = _url => {
    let { hostname } = new URL(_url)
    hostname = hostname.split('.')
    if (hostname.length > 2)
      hostname = _.drop(hostname)
    return hostname.join('.')
  }
}

render(<Root />, document.getElementById('root'))

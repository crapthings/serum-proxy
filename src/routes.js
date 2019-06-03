import { render } from 'react-dom'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom'

import { createBrowserHistory } from 'history'

import {
  Menu,
  Settings,
} from './components'

class Root extends Component {
  render() {
    return (
      <Router history={app.route}>
        <Switch>
          <Route path='/menu.html' component={Menu} />
          <Route path='/settings.html' component={Settings} />
        </Switch>
      </Router>
    )
  }
}

render(<Root />, document.getElementById('root'))

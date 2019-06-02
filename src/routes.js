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
  Options,
} from './components'

class Root extends Component {
  render() {
    return (
      <Router history={app.route}>
        <Switch>
          <Route path='/menu.html' component={Menu} />
          <Route path='/options.html' component={Options} />
        </Switch>
      </Router>
    )
  }
}

render(<Root />, document.getElementById('root'))

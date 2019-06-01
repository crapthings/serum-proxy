import { render } from 'react-dom'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom'

import { createBrowserHistory } from 'history'

import {
  Home
} from './components'

class Root extends Component {
  render() {
    return (
      <Router history={app.route}>
        <Switch>
          <Route path='/index.html' component={Home} />
        </Switch>
      </Router>
    )
  }
}

render(<Root />, document.getElementById('root'))

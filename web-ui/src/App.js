import './App.scss';
import { Container } from 'react-bootstrap';
import { Switch, Route, withRouter } from 'react-router-dom';
import TopBar from './components/TopBar';
import MyEvents from './components/MyEvents';
import Register from './components/Register';
import EventsNew from './components/EventsNew';
import EventsShow from './components/EventsShow';
import EventsEdit from './components/EventsEdit';

import store from './store'

function App({ history }) {
  history.listen((location, action) => {
    store.dispatch({
      type: 'banners/clear'
    })
  })

  return (
    <Container>
      <TopBar />
      <Switch>
        <Route path="/" exact>
          <MyEvents />
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route>
        <Route path="/events/new" exact>
          <EventsNew />
        </Route>
        <Route path="/events/:id/edit">
          <EventsEdit />
        </Route>
        <Route path="/events/:id">
          <EventsShow />
        </Route>
      </Switch>
    </Container>
  );
}

export default withRouter(App);

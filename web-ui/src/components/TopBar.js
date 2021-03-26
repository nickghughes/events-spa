import { Row, Col, InputGroup, Alert, Form, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useState } from 'react';
import { connect } from 'react-redux'
import { api_login } from '../api'

let LoggedIn = connect()(({session, dispatch}) => {
  let history = useHistory();

  function logout() {
    history.push("/");
    dispatch({type: 'session/clear'});
  }

  return (
    <Row className="my-2">
      <Col md={5} className="nav-link"><Link to="/">Home</Link></Col>
      <Col md={7} className="text-right">
        Logged in as {session.name} |&nbsp;
        <Button variant="link" onClick={logout} className="p-0 border-0 nav-btn">Logout</Button>
      </Col>
    </Row>
  );
});

function LoginOrRegister() {
  let history = useHistory();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function login(ev) {
    ev.preventDefault();
    api_login(email, pass).then(() => {
      if (history.location.state?.redirect) {
        history.push(history.location.state.redirect);
      }
    });
  }

  function register() {
    history.push("/register");
  }

  return (
    <Row className="my-2">
      <Col md={8}>
        <Form onSubmit={login}>
          <InputGroup>
            <Form.Control name="email" type="email" onChange={(ev) => setEmail(ev.target.value)} value={email} placeholder="Email" />
            <Form.Control name="password" type="password" onChange={(ev) => setPass(ev.target.value)} value={pass} placeholder="Password" />
            <InputGroup.Append>
              <Button type="submit">Login</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      </Col>
      <Col md={{ offset: 2, span: 2 }} className="text-right">
        <Button variant="link" onClick={register}>Register</Button>
      </Col>
    </Row>
  );
}

function TopBar({session, error, info, success}) {
  return (
    <div>
      {session ? <LoggedIn session={session} /> : <LoginOrRegister />}
      {success &&
        <Row>
          <Col>
            <Alert variant="success">{success}</Alert>
          </Col>
        </Row>
      }
      {info &&
        <Row>
          <Col>
            <Alert variant="info">{info}</Alert>
          </Col>
        </Row>
      }
      {error &&
        <Row>
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      }
    </div>
  );
}

export default connect(({session, error, info, success}) => ({session, error, info, success}))(TopBar);
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { register, fetch_events, dispatch_banners } from '../api';
import { useHistory } from 'react-router-dom';

function Register() {
  let history = useHistory();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const [errors, setErrors] = useState({});

  function updatePass1(pass) {
    let e = Object.assign({}, errors);
    if (pass.length < 8) {
      e.pass1 = "Password must be 8 characters."
      setErrors(e);
    } else {
      delete e.pass1;
      setErrors(e);
    }
    setPass1(pass);
  }

  function submitDisabled() {
    return email.length === 0 || name.length === 0 || pass1.length < 8 || pass2.length < 8;
  }
  
  function onSubmit(ev) {
    ev.preventDefault();

    if (pass2 !== pass1) {
      let e = Object.assign({}, errors);
      e.pass2 = "Passwords do not match."
      setErrors(e);
      return;
    }

    let data = {
      email, name, password: pass1
    };
    register(data).then((data) => {
      fetch_events();
      history.push(history.location.state?.redirect || "/");
      dispatch_banners(data);
    })
  }

  return (
    <div>
      <h1> Register </h1>
      <Form onSubmit={onSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Control type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} placeholder="Email" />
              <p className="text-danger" value={errors.email}></p>
            </Form.Group>
            <Form.Group>
              <Form.Control type="text" value={name} onChange={(ev) => setName(ev.target.value)} placeholder="Name" />
              <small className="text-danger">{errors.name}</small>
            </Form.Group>
            <Form.Group>
              <Form.Control type="password" value={pass1} onChange={(ev) => updatePass1(ev.target.value)} placeholder="Password" />
              <small className="text-danger">{errors.pass1}</small>
            </Form.Group>
            <Form.Group>
              <Form.Control type="password" value={pass2} onChange={(ev) => setPass2(ev.target.value)} placeholder="Confirm Password" />
              <small className="text-danger">{errors.pass2}</small>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={submitDisabled()}> Register </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default Register;
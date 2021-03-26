import { connect } from "react-redux";
import { Row, Col, Button, Card, Form, InputGroup, Table } from 'react-bootstrap';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { update_invite, send_invite, create_comment, delete_comment, fetch_event } from '../api';

function Comment({comment, userId, ownerId}) {

  function deleteComment() {
    delete_comment(comment.id);
  }
  
  return (
    <Row className="mx-2 my-2">
      <Col className="my-0 py-0">
        <Card>
          <Card.Header>
            <Row>
              <Col className="text-left">
                <b>{comment.user.name}</b>
              </Col>
              <Col className="text-right">
                {comment.date}
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col>
                {comment.body}
              </Col>
            </Row>
          </Card.Body>
          {(comment.user.id === userId || ownerId === userId) &&
            <Card.Link className="text-right mb-2 mr-1">
              <Button variant="link" className="btn-sm text-danger" onClick={deleteComment}> Delete </Button>
            </Card.Link>
          }
        </Card>
      </Col>
    </Row>
  );
}

function CommentBox({ eventId }) {
  const [comment, setComment] = useState("");

  function onSubmit(ev) {
    ev.preventDefault();
    create_comment(eventId, comment).then(() => {
      setComment("");
    });
  }

  return (
    <Form onSubmit={onSubmit}>
      <Row className="mx-2 mt-3">
        <Col>
          <Form.Control as="textarea" placeholder="Enter comment here..." value={comment} onChange={(ev) => setComment(ev.target.value)} />
        </Col>
      </Row>
      <Row className="my-2 mx-2 text-right">
        <Col className="mx-2">
          <Button type="submit" variant="primary" className="btn-sm">Save Comment</Button>
        </Col>
      </Row>
    </Form>
  );
}

function InviteResponse({ invite }) {
  const [response, setResponse] = useState(invite.response);

  let responses = ["yes", "no", "maybe"];

  function onSubmit(ev) {
    ev.preventDefault();
    update_invite(Object.assign({}, invite, {response: response}))
  }

  return <div>
    <h4>Going?</h4>
    <Form onSubmit={onSubmit}>
        {responses.map((res) =>
          <Form.Check type="radio" label={res} inline key={`radio-${res}`} checked={response === res} onChange={() => setResponse(res)} />
        )}
        <Row className="text-center">
          <Col>
            <Button type="submit" variant="info" className="btn-sm my-2">Save</Button>
          </Col>
        </Row>
    </Form>
  </div>
}

function InvitesDisplay({ event, invites }) {
  const [email, setEmail] = useState("");
  const [showLink, setShowLink] = useState(false);

  let responses = ["yes", "no", "maybe", "TBD"];
  let responseKeys = ["yes", "no", "maybe", "nil"];

  function sendInvite(ev) {
    ev.preventDefault();
    send_invite(event.id, email).then(() => {
      setEmail("");
      setShowLink(true);
    });
  }

  function inviteRows() {
    let rows = [];

    for (let i = 0; i < Math.max(...Object.values(invites).map((names) => names.length)); i++) {
      rows.push(
        <tr key={i}>
          {responseKeys.map((res, idx) => 
            <td key={idx}>
              {invites[res].length > i ? invites[res][i] : ""}
            </td>
          )}
        </tr>
      );
    }
    return rows;
  }

  return <div>
    <Row><Col><h5>Invite people:</h5></Col></Row>
    <Row className="mt-1 mb-3">
      <Col>
        <Form onSubmit={sendInvite}>
          <InputGroup>
            <Form.Control type="email" placeholder="Email" onChange={(ev) => setEmail(ev.target.value)} />
            <InputGroup.Append>
              <Button type="submit" variant="info">Save</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      </Col>
    </Row>
    {(showLink || Object.values(invites).flat().length > 0) && 
      <div className="my-3 text-center">
        <p>Invitees can respond through this link:</p>
        <b>{window.location.href}</b>
      </div>
    }
    <Row>
      <Col><h4>Who's Going?</h4></Col>
    </Row>
    <Row className="mb-3">
      <Col>
        {responses.map((res) => `${invites[res === "TBD" ? "nil" : res].length} ${res}`).join(', ')}
      </Col>
    </Row>
    <Table className="table-sm">
      <thead>
        <tr>
          {responses.map((res) => <th key={res}>{res}</th>)}
        </tr>
      </thead>
      <tbody>
        {inviteRows()}
      </tbody>
    </Table>
  </div>
}

function EventsShow({session, event}) {
  const [fetched, setFetched] = useState(false);
  let { id } = useParams();
  let history = useHistory();
  
  useEffect(() => {
    if (!fetched) {
      setFetched(true);
      fetch_event(id).catch(() => {
        history.push({
          pathname: "/register",
          state: { redirect: `/events/${id}` }
        });
      });
    }
  });

  return (
    fetched && event ?
    <Row className="mb-5">
      <Col lg={{offset: 1, span: 7}}>
        <Card>
          <Card.Subtitle className="text-right mt-3 mr-3">
            <b> Created by: </b> {event.user.name}
          </Card.Subtitle>
          <Card.Title className="text-center my-2">
            <h1>{event.title}</h1>
          </Card.Title>
          <Card.Title className="text-center my-2">
            <h3>{event.date_display}</h3>
          </Card.Title>
          <Card.Text className="text-center my-2">
            <small>{event.description}</small>
          </Card.Text>
          {session.user_id === event.user.id &&
            <Col xs={6} className="text-right my-3 mx-auto">
              <Link to={`/events/${event.id}/edit`} className="btn btn-block btn-secondary">Edit</Link>
            </Col>
          }
          {event.comments.map((comment) => 
            <Comment comment={comment} userId={session.user_id} ownerId={event.user.id} key={comment.id}/>
          )}
          <CommentBox eventId={event.id} />
        </Card>
      </Col>
      <Col lg={4} className="text-center">
        {event.invite &&
          <InviteResponse invite={event.invite} />
        }
        {event.invites &&
          <InvitesDisplay event={event} invites={event.invites} />
        }
      </Col>  
    </Row> :
    <div></div>
  );
}

export default connect(({session, event}) => ({session, event}))(EventsShow);
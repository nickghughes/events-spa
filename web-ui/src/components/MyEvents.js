import { Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetch_event } from '../api';
import { useHistory } from 'react-router-dom';

function Event({event, userId}) {
  return (
    <Col xl={3} className="my-2">
      <Card>
        <Card.Body>
          <Card.Subtitle className="text-right">
            <small><b>Created by: </b> {event.user.name} </small>
          </Card.Subtitle>
          <Card.Title className="text-center my-2"><h5>{event.title}</h5></Card.Title>
          <Card.Title className="text-center my-2"><h6>{event.date_display}</h6></Card.Title>
          <Card.Text className="text-center my-2"><small>{event.description}</small></Card.Text>
          <Row>
            <Col xs={7} className="text-center mx-auto">
              <Link to={`/events/${event.id}`} className="btn btn-block btn-info">View</Link>
            </Col>
            {userId === event.user.id &&
              <Col xs={5} className="text-center">
                <Link to={`/events/${event.id}/edit`} className="btn btn-block btn-secondary">Edit</Link>
              </Col>
            }
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}

function MyEvents({events, session}) {
  let history = useHistory();

  function newEvent() {
    history.push("/events/new");
  }

  return (
    <div>
      <Row>
        <Col><h1>My Events</h1></Col>
        {session &&
          <Col className="text-right">
            <Button variant="primary" onClick={newEvent}>New Event</Button>
          </Col>
        }
      </Row>
      <Row>
        {session 
          ? events.map((event) => <Event event={event} userId={session.user_id} key={event.id} />)
          : <Col className="mx-auto text-center">
              <h5>Please log in above or <Link to="/register">Register</Link> to view events</h5>
            </Col>}
      </Row>
    </div>
  );
}

export default connect(({events, session}) => ({events, session}))(MyEvents);
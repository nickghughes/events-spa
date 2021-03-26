import { Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { update_event, fetch_event, fetch_events, dispatch_banners } from '../api';
import store from '../store';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

function EventsEdit({ event }) {
  let history = useHistory();
  let { id } = useParams();

  useEffect(() => {
    if (!fetched) {
      setFetched(true);
      fetch_event(id).then(() => {
        let state = store.getState();
        setTitle(state?.event?.title);
        setDescription(state?.event?.description);
        setDate(new Date(state?.event?.date));
      }).catch((data) => {
        fetch_events();
        history.push("/");
        dispatch_banners(data);
      });
    }
  })

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [fetched, setFetched] = useState(false);

  function onSubmit(ev) {
    ev.preventDefault();
    let offsetDate = new Date(date);
    offsetDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    let data = Object.assign({}, event, { title, description, date: offsetDate });
    update_event(data).then((data) => {
      fetch_events();
      history.push("/");
      dispatch_banners(data);
    })
  }

  return event ? <div>
    <h1> Edit Event </h1>
    <Form onSubmit={onSubmit}>
      <Form.Group className="my-4">
        <Form.Control type="text" placeholder="Event Title" value={title} onChange={(ev) => setTitle(ev.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Control as="textarea" placeholder="Description" value={description} onChange={(ev) => setDescription(ev.target.value)} />
      </Form.Group>
      <DateTimePicker value={date} onChange={setDate} />

      <div className="mt-3">
        <Button type="submit" variant="primary">Save</Button>
      </div>
    </Form>
  </div> : <div></div>
}

export default connect(({event}) => ({event}))(EventsEdit);
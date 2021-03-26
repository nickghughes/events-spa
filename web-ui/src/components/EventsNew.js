import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { create_event, fetch_events } from '../api';
import { useHistory } from 'react-router-dom';

function EventsNew() {
  let history = useHistory();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState();

  function onSubmit(ev) {
    ev.preventDefault();
    let offsetDate = new Date(date);
    offsetDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    let data = {
      title, description, date: offsetDate
    };
    create_event(data).then(() => {
      fetch_events();
      history.push("/");
    })
  }

  function disableSubmit() {
    return !(title.length > 0 && date);
  }

  return <div>
    <h1> New Event </h1>
    <Form onSubmit={onSubmit}>
      <Form.Group className="my-4">
        <Form.Control type="text" placeholder="Event Title" value={title} onChange={(ev) => setTitle(ev.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Control as="textarea" placeholder="Description" value={description} onChange={(ev) => setDescription(ev.target.value)} />
      </Form.Group>
      <DateTimePicker value={date} onChange={setDate} />

      <div className="mt-3">
        <Button type="submit" variant="primary" disabled={disableSubmit()}>Save</Button>
      </div>
    </Form>
  </div>
}

export default EventsNew;
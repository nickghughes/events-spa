import store from './store';

/*
 * Credit lecture notes for starter code for this file:
 * https://github.com/NatTuck/scratch-2021-01/blob/19057127559577ba3a0bb50b5f72d12c43194b73/4550/0323/photo-blog-spa/web-ui/src/api.js
 */

function tokenHeader() {
  return {
    'x-auth': store.getState()?.session?.token
  }
}

// TODO Fix banner logic, wait until all use cases are met though
function dispatch_banners(data) {
  store.dispatch({
    type: 'error/set',
    data: data.error
  });
  store.dispatch({
    type: 'info/set',
    data: data.info
  });
  store.dispatch({
    type: 'success/set',
    data: data.success
  });
}

async function api_get(path) {
  let text = await fetch(
    "http://localhost:4000/api/v1" + path, {
      headers: tokenHeader()
    });
  let resp = await text.json();
  dispatch_banners(resp);
  return resp.data;
}

async function api_post(path, data) {
  let opts = {
    method: 'POST',
    headers: Object.assign({
      'Content-Type': 'application/json'
    }, tokenHeader()),
    body: JSON.stringify(data),
  };
  let text = await fetch(
    "http://localhost:4000/api/v1" + path, opts);
  let resp = await text.json();
  dispatch_banners(resp);
  return resp;
}

async function api_patch(path, data) {
  let opts = {
    method: 'PATCH',
    headers: Object.assign({
      'Content-Type': 'application/json'
    }, tokenHeader()),
    body: JSON.stringify(data),
  };
  let text = await fetch(
    "http://localhost:4000/api/v1" + path, opts);
  let resp = await text.json();
  dispatch_banners(resp);
  return resp;
}

async function api_delete(path) {
  let opts = {
    method: 'DELETE',
    headers: Object.assign({
      'Content-Type': 'application/json'
    }, tokenHeader())
  };
  await fetch("http://localhost:4000/api/v1" + path, opts);
}

export function api_login(email, password) {
  return api_post("/session", {email, password}).then((data) => {
    if (data.session) {
      let action = {
        type: 'session/set',
        data: data.session,
      }
      store.dispatch(action);
      fetch_events();
    }
  });
}

export function register(user) {
  return api_post("/users", {user}).then((data) => {
    if (data.session) {
      let action = {
        type: 'session/set',
        data: data.session,
      }
      store.dispatch(action);
    }
  });
}

export function fetch_events() {
  return api_get("/events").then((data) => {
    let action = {
      type: 'events/set',
      data: data
    }
    store.dispatch(action);
  })
}

export function create_event(event) {
  return api_post("/events", {event});
}
export function update_event(event) {
  return api_patch(`/events/${event.id}`, {event});
}

export function fetch_event(eventId) {
  return api_get(`/events/${eventId}`).then((data) => {
    let action = {
      type: 'event/set',
      data: data
    }
    store.dispatch(action);
  })
}

export function update_invite(invite) {
  return api_patch(`/invites/${invite.id}`, { invite });
}

export function send_invite(eventId, email) {
  return api_post(`/invites`, { invite: { event_id: eventId, email }})
}

export function create_comment(eventId, body) {
  return api_post(`/comments`, { comment: { event_id: eventId, body } }).then((data) => {
    let state = store.getState();
    let comment = Object.assign({}, data["comment"], { user: { name: state?.session?.name, id: state?.session?.user_id }})
    let comments = state?.event?.comments || [];
    comments.push(comment);
    let event1 = Object.assign({}, state?.event || {}, {comments: comments});
    let action = {
      type: 'event/set',
      data: event1
    }
    store.dispatch(action);
  })
}

export function delete_comment(commentId) {
  return api_delete(`/comments/${commentId}`).then(() => {
    let state = store.getState();
    let comments = state?.event?.comments.filter((c) => c.id !== commentId);
    let event1 = Object.assign({}, state?.event || {}, {comments: comments});
    let action = {
      type: 'event/set',
      data: event1
    }
    store.dispatch(action);
  })
}

export function init_state() {
  fetch_events();
}
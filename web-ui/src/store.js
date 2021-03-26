import { createStore, combineReducers } from 'redux';

/*
 * Credit lecture notes for much of this file's code (particularly session logic):
 * https://github.com/NatTuck/scratch-2021-01/blob/19057127559577ba3a0bb50b5f72d12c43194b73/4550/0323/photo-blog-spa/web-ui/src/store.js
 */

function events(state = [], action) {
  switch (action.type) {
    case 'events/set':
      return action.data;
    default:
      return state;
  }
}

function save_session(sess) {
  let session = Object.assign({}, sess, {time: Date.now()});
  localStorage.setItem("session", JSON.stringify(session));
}

function load_session() {
  let session = localStorage.getItem("session");
  if (!session) {
    return null;
  }
  session = JSON.parse(session);
  let age = Date.now() - session.time;
  let hours = 60*60*1000;
  if (age < 24 * hours) {
    return session;
  }
  else {
    return null;
  }
}

function session(state = load_session(), action) {
  switch (action.type) {
    case 'session/set':
      save_session(action.data);
      return action.data;
    case 'session/clear':
      localStorage.removeItem("session");
      return null;
    default:
      return state;
  }
}

function event(state = null, action) {
  switch (action.type) {
    case 'event/set':
      return action.data;
    default:
      return state;
  }
}

function error(state = null, action) {
  switch (action.type) {
    case 'error/set':
      return action.data;
    case 'banners/clear', 'session/clear':
      return null;
    default:
      return state;
  }
}

function info(state = null, action) {
  switch (action.type) {
    case 'info/set':
      return action.data;
    case 'session/clear':
      return "Logged out.";
    case 'banners/clear':
      return null;
    default:
      return state;
  }
}

function success(state = null, action) {
  switch (action.type) {
    case 'success/set':
      return action.data;
    case 'banners/clear', 'session/clear':
      return null;
    default:
      return state;
  }
}

function root_reducer(state, action) {
  let redu = combineReducers(
    {events, event, session, error, info, success}
  );

  return redu(state, action);
}

let store = createStore(root_reducer);
export default store;
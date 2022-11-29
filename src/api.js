import {server} from 'siap/src/config';
import axios from 'axios';
import auth_store from 'siap/src/store/auth';

let state = auth_store.getState();
let jwt = state.token;

const then_promise = (method, response, success_calback, error_calback) => {
  if (200 == response.status) {
    let api_response = response.data;

    if ('success' == api_response.status) {
      success_calback(api_response.data);
    } else if ('error' == api_response.status) {
      error_calback(api_response.message);
    } else {
      console.log(method + ' ' + ' server error', response);

      console.log({
        title: 'Server Error',
        textBody:
          'Sorry, the server is currently under maintenance, please try again later',
      });
    }
  } else {
    console.log({
      title: 'Response Error',
      textBody: 'Error on response server with status code ' + response.status,
    });
  }
};

const catch_promise = (method, error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(method + ' data', error.response.data);
    console.log(method + ' status', error.response.status);
    console.log(method + ' headers', error.response.headers);

    console.log({
      title: 'Response Error',
      textBody:
        'Error on response server with status code ' + error.response.status,
    });
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(method + ' request ', error.request);

    console.log({
      title: 'Request Error',
      textBody: 'Please check your internet connection',
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log(method, error.message);

    console.log({
      title: 'Server Error',
      textBody:
        'Sorry, the server is currently under maintenance, please try again later',
    });
  }
};

const fullUrl = url => {
  return server + url;
};

const get = params => {
  const instance = axios.create({
    timeout: 5000,
    headers: {Authorization: 'Bearer ' + jwt},
  });

  let url = server + params.url,
    data = params.hasOwnProperty('data') ? params.data : {},
    success_calback = params.hasOwnProperty('success')
      ? params.success
      : () => {},
    error_calback = params.hasOwnProperty('error') ? params.error : () => {};

  return instance
    .get(url, {params: data})
    .then(response =>
      then_promise('get', response, success_calback, error_calback),
    )
    .catch(error => catch_promise('get', error));
};

const post = params => {
  const instance = axios.create({
    timeout: 5000,
    headers: {Authorization: 'Bearer ' + jwt},
  });

  let url = server + params.url,
    data = params.hasOwnProperty('data') ? params.data : {},
    success_calback = params.hasOwnProperty('success')
      ? params.success
      : () => {},
    error_calback = params.hasOwnProperty('error') ? params.error : () => {};

  return instance
    .post(url, data)
    .then(response =>
      then_promise('post', response, success_calback, error_calback),
    )
    .catch(error => catch_promise('post', error));
};

const freeGet = params => {
  let url = server + params.url;
  (data = params.hasOwnProperty('data') ? params.data : {}),
    (success_calback = params.hasOwnProperty('success')
      ? params.success
      : () => {}),
    (error_calback = params.hasOwnProperty('error') ? params.error : () => {});

  return axios
    .get(url, {params: data})
    .then(response =>
      then_promise('free post', response, success_calback, error_calback),
    )
    .catch(error => catch_promise('free post', error));
};

const freePost = params => {
  let url = server + params.url,
    data = params.hasOwnProperty('data') ? params.data : {},
    success_calback = params.hasOwnProperty('success')
      ? params.success
      : () => {},
    error_calback = params.hasOwnProperty('error') ? params.error : () => {};

  return axios
    .post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response =>
      then_promise('free post', response, success_calback, error_calback),
    )
    .catch(error => catch_promise('free post', error));
};

export {fullUrl, get, post, freeGet, freePost};

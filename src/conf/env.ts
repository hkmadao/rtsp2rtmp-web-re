let env = process.env.NODE_ENV;
let serverURL;
let directServerUrl;

if (env === 'development') {
  // serverURL = 'http://127.0.0.1:8080';
  serverURL = '/api'
  directServerUrl = 'http://127.0.0.1:8080';
} else if (env === 'production') {
  serverURL = window.location.origin;
  directServerUrl = window.location.origin;
}

const Env = { serverURL: serverURL, directServerUrl };

export default Env;

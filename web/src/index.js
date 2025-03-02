/*index.js*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/reset.css'

import axios from 'axios';

// without dynamic IP designate
// axios.defaults.baseURL = "http://127.0.0.1:8081";
// equipped with dynamic IP designate
axios.defaults.baseURL = "http://" + window.location.hostname + ":8081";

ReactDOM.render(<App/>, document.getElementById('root'));

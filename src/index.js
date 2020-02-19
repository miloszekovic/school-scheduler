import './styles/bootstrap.css';
import './styles/icofont.css';
import './styles/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from './views/Root';
import { history } from './lib/history';

ReactDOM.render(<Root history={history} />, document.getElementById('root'));

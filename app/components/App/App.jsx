/**
 * App component
 *
 * Description of component... lorem ipsum dolor sit amet consectetur adipiscing elit
 */

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from '../Main/Main';
import Another from '../Another/Another';

import '../../css/app.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/another/" component={Another} />
      </Switch>
    );
  }
}

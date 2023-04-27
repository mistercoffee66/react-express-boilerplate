/**
 * Another component
 *
 * Description of component... lorem ipsum dolor sit amet consectetur adipiscing elit
 */

import React from 'react';
import { Link } from 'react-router-dom';

import './Another.scss';

import imageEmojiFrown from '../../images/sample-emoji-frown.png';

export default class Another extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <main className="page-another">
        <Link to="/">Main route</Link>
        | Another route
        <div>
          <img src={imageEmojiFrown} alt="" />
        </div>
      </main>
    );
  }
}

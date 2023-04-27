/**
 * Main component
 *
 * Description of component... lorem ipsum dolor sit amet consectetur adipiscing elit
 */

import React from 'react';
import { Link } from 'react-router-dom';

import './Main.scss';

import imageEmojiSmile from '../../images/sample-emoji-smile.png';

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <main className="page-main">
                Main route |&nbsp;
                <Link to="/another/">Another route</Link>
                <div>
                    <img src={imageEmojiSmile} alt="" />
                </div>
            </main>
        );
    }
}

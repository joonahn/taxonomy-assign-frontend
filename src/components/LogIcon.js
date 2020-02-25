import React from 'react';
import { Icon } from "semantic-ui-react";
import { downloadUrl } from '../remote.js'

class LogIcon extends React.Component {
    handleClick() {
        window.open(`${downloadUrl}/${this.props.logdir}`)
    }
    render() {
        const isActivated = this.props.logdir !== ""
        return <Icon link={isActivated} disabled={!isActivated} name="bug" onClick={() => this.handleClick()}/>
    }
}

export default LogIcon;
import React from 'react';
import { Icon } from "semantic-ui-react";
import { deleteAssignResult } from '../remote.js'

const removableState = ["FINISHED", "FAILED"]

class DeleteIcon extends React.Component {
    handleClick() {
        deleteAssignResult(this.props.dataId).then(() => {
            console.log(this.props.onFininshed)
            if (this.props.onFininshed !== undefined) {
                this.props.onFininshed()
            }
        })
    }
    render() {
        const isActivated = removableState.includes(this.props.state)
        return <Icon link={isActivated} disabled={!isActivated} name="trash alternate" onClick={() => this.handleClick()}/>
    }
}

export default DeleteIcon;
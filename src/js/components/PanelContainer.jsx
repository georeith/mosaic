import React from 'react';

export default function PanelContainer(props) {
    return (
        <div
            style={Object.assign({
                alignItems: 'stretch',
                flexDirection: 'column',
            }, props.style, {
                display: 'flex',
            })}>
            {props.children}
        </div>
    );
}

PanelContainer.propTypes = {
    style: React.PropTypes.object,
    children: React.PropTypes.node,
};

import 'scss/panel.scss';

import React from 'react';

export default function Panel(props) {
    const label = props.label ? (
        <div className="panel-header">{props.label}</div>
    ) : null;
    return (
        <div
            style={Object.assign({}, props.style, {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            })}>
            {label}
            {props.children}
        </div>
    );
}

Panel.propTypes = {
    label: React.PropTypes.string,
    style: React.PropTypes.object,
    children: React.PropTypes.node,
};

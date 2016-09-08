import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ imageSrc: state.image.src });

export default connect(mapStateToProps)(({ imageSrc }) => {
    const image = imageSrc ? (
        <img
            style={{
                flexShrink: 0,
            }}
            onLoad={draw}
            src={imageSrc}
            alt="target"
        />
    ) : null;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'auto',
                flexGrow: 1,
            }}>
            {image}
            <canvas
                style={{
                    flexShrink: 0,
                }}
            />
        </div>
    );
});

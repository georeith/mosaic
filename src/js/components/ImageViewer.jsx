import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ imageSrc: state.imageSrc });

export default connect(mapStateToProps)(({ imageSrc }) => {
    function imageOnload(event) {
        console.log(event);
    }

    return imageSrc ? (
        <img src={imageSrc} onLoad={imageOnload} alt="target" />
    ) : null;
});

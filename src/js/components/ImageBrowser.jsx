import React from 'react';
import { connect } from 'react-redux';

import { setImageSrc } from '~/actions/image';

export default connect()(({ dispatch }) => {
    let fileInput;

    function onFileUpload({ target: { files: [file] } }) {
        const reader = new FileReader();
        reader.onload = ({ target: { result } }) => {
            dispatch(setImageSrc(result));
        };
        reader.readAsDataURL(file);
    }

    function triggerFileUpload(event) {
        event.preventDefault();
        fileInput.click();
    }

    return (
        <form>
            <input
                type="file"
                ref={input => { fileInput = input; }}
                onChange={onFileUpload}
                style={{ display: 'none' }}
            />
            <button onClick={triggerFileUpload}>Browse...</button>
        </form>
    );
});

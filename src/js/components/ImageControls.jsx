import 'scss/form.scss';

import React from 'react';
import { connect } from 'react-redux';

import { setImageBitmap } from '~/actions/image';
import { setPieces, setColors } from '~/actions/options';


const mapStateToProps = state => ({
    pieces: state.options.pieces,
    colors: state.options.colors,
});

export default connect(mapStateToProps)(({ dispatch, pieces, colors }) => {
    function onFileUpload({ target: { files: [file] } }) {
        createImageBitmap(file).then(imageBitmap => {
            dispatch(setImageBitmap(imageBitmap));
        });
    }

    return (
        <form className="controls" style={{ flexGrow: 0, flexShrink: 0 }}>
            <div className="form-group">
                <label htmlFor="image-input">Image</label>
                <input
                    type="file"
                    onChange={onFileUpload}
                    id="image-input"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="pieces-input">Pieces</label>
                <input
                    onChange={event => dispatch(setPieces(event.target.value))}
                    type="number"
                    min="2"
                    step="2"
                    id="pieces-input"
                    value={pieces}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="colors-input">Colours</label>
                <input
                    onChange={event => dispatch(setColors(event.target.value))}
                    type="number"
                    min="1"
                    step="1"
                    id="colors-input"
                    value={colors}
                    className="form-control"
                />
            </div>
        </form>
    );
});

import 'scss/form.scss';

import React from 'react';
import { connect } from 'react-redux';

import { setImageBitmap } from '~/actions/image';
import {
    setPieceCount,
    setColorCount,
    setDitheringType,
    setSerpentineDithering,
} from '~/actions/options';


const mapStateToProps = state => ({
    pieceCount: state.options.pieceCount,
    colorCount: state.options.colorCount,
    ditheringType: state.options.ditheringType,
    serpentineDithering: state.options.serpentineDithering,
});

export default connect(mapStateToProps)(({
    dispatch,
    pieceCount,
    colorCount,
    ditheringType,
    serpentineDithering,
}) => {
    let colorInput;

    function onFileUpload({ target: { files: [file] } }) {
        createImageBitmap(file).then(imageBitmap => {
            dispatch(setImageBitmap(imageBitmap));
        });
    }

    function colorClick() {
        colorInput.click();
    }

    const ditheringTypes = {
        'none': null,
        'Floyd Steinberg': 'FloydSteinberg',
        'False Floyd Steinberg': 'FalseFloydSteinberg',
        'Stucki': 'Stucki',
        'Atkinson': 'Atkinson',
        'Jarvis': 'Jarvis',
        'Burkes': 'Burkes',
        'Sierra': 'Sierra',
        'Two Sierra': 'TwoSierra',
        'Sierra Lite': 'SierraLite',
    };

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
                <label htmlFor="piece-count-input">Pieces</label>
                <input
                    onChange={event => dispatch(setPieceCount(event.target.value))}
                    type="number"
                    min="1"
                    step="1"
                    id="piece-count-input"
                    value={pieceCount}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="color-count-input">Colours</label>
                <input
                    onChange={event => dispatch(setColorCount(event.target.value))}
                    type="number"
                    min="1"
                    step="1"
                    id="color-count-input"
                    value={colorCount}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="colors-input">Palette</label>
                <input
                    ref={input => { colorInput = input; }}
                    type="color"
                    style={{ visibility: 'hidden' }}
                    id="colors-input"
                />
                <ul className="color-group">
                    <li className="color-swatch" onClick={colorClick}>+</li>
                </ul>
            </div>
            <div className="form-group">
                <label htmlFor="dithering-type-input">Dithering</label>
                <select
                    id="dithering-type-input"
                    value={ditheringType}
                    onChange={event => dispatch(setDitheringType(event.target.value))}>
                    {
                        Object.keys(ditheringTypes).map(name => {
                            const value = ditheringTypes[name];
                            return <option key={name} value={value} label={name} />;
                        })
                    }
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="serpentine-dithering-input">Serpentine dithering</label>
                <input
                    type="checkbox"
                    id="serpentine-dithering-input"
                    checked={serpentineDithering}
                    onChange={event => dispatch(setSerpentineDithering(event.target.checked))}
                />
            </div>
        </form>
    );
});

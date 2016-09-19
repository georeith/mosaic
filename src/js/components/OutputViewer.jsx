import React from 'react';
import { connect } from 'react-redux';
import RgbQuant from 'rgbquant';

const mapStateToProps = state => ({
    imageBitmap: state.image,
    colorCount: state.options.colorCount,
    pieceCount: state.options.pieceCount,
    ditheringType: state.options.ditheringType,
    serpentineDithering: state.options.serpentineDithering,
});

class OutputViewer extends React.Component {
    static propTypes = {
        imageBitmap: React.PropTypes.object,
        colorCount: React.PropTypes.number,
        pieceCount: React.PropTypes.number,
        ditheringType: React.PropTypes.string,
        serpentineDithering: React.PropTypes.bool,
    };

    componentDidMount() {
        this.drawImage();
    }

    componentDidUpdate() {
        this.drawImage();
    }

    closestDimensionsWithArea(area, width, height) {
        const actualArea = width * height;
        const divisor = Math.sqrt(actualArea / area);

        return {
            width: Math.floor(width / divisor),
            height: Math.floor(height / divisor),
        };
    }

    drawImage() {
        const imageBitmap = this.props.imageBitmap;
        if (imageBitmap) {
            console.log(this.props.serpentineDithering);
            const rgbQuant = new RgbQuant({
                colors: this.props.colorCount,
                minHueColors: 3,
                dithKern: this.props.ditheringType,
                dithSerp: this.props.serpentineDithering,
            });
            // const { width, height } = this.closestDimensionsWithArea(this.props.pieceCount, imageBitmap.width, imageBitmap.height);
            const { width, height } = imageBitmap;
            const sampleCanvas = document.createElement('canvas');
            sampleCanvas.width = width;
            sampleCanvas.height = height;
            const sampleContext = sampleCanvas.getContext('2d');
            sampleContext.drawImage(imageBitmap, 0, 0, width, height);
            rgbQuant.sample(sampleContext);
            const quantUint8Array = new Uint8ClampedArray(rgbQuant.reduce(sampleContext));
            const context = this.canvas.getContext('2d');
            const imageData = context.createImageData(width, height);
            imageData.data.set(quantUint8Array);
            context.putImageData(imageData, 0, 0);
        }
    }

    render() {
        const imageBitmap = this.props.imageBitmap || {
            width: 0,
            height: 0,
        };

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
                <canvas
                    ref={canvas => { this.canvas = canvas; }}
                    width={imageBitmap.width}
                    height={imageBitmap.height}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(OutputViewer);

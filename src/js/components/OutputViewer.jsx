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

const pieceSize = 7;
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
            const rgbQuant = new RgbQuant({
                colors: this.props.colorCount,
                dithKern: this.props.ditheringType,
                dithSerp: this.props.serpentineDithering,
                minHueCols: 256,
                initColors: 8192,
                reIndex: true,
                method: 1,
                boxSize: [1, 1],
                palette: [
                    // [180, 209, 246],
                    // [249, 121, 52],
                    // [255, 205, 223],
                    // [164, 213, 201],
                    // [255, 193, 85],
                    // [2, 122, 138],
                    // [225, 13, 10],
                    // [171, 0, 80],
                    // [204, 117, 183],
                    // [255, 219, 210],
                    // [255, 255, 255],
                    // [0, 0, 0],

                    // [209, 242, 165],
                    // [239, 250, 180],
                    // [255, 196, 140],
                    // [255, 159, 128],
                    // [245, 105, 145],
                    // [255, 255, 255],
                    // [0, 0, 0],
                ],
            });
            // const { width, height } = imageBitmap;
            const { width, height } = this.closestDimensionsWithArea(this.props.pieceCount, imageBitmap.width, imageBitmap.height);
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
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const i = ((y * width) + x) * 4;
                    const rgb = quantUint8Array.slice(i, i + 3);
                    this.drawCircle(context, x * pieceSize, y * pieceSize, pieceSize / 2, rgb);
                }
            }
        }
    }

    drawCircle(context, x, y, radius, [red, green, blue]) {
        context.save();
        context.beginPath();
        context.arc(x + radius, y + radius, radius, 0, 2 * Math.PI, false);
        /* eslint-disable no-param-reassign */
        context.fillStyle = `rgb(${red},${green},${blue})`;
        /* eslint-enable no-param-reassign */
        context.fill();
        context.closePath();
        context.restore();
    }

    render() {
        const imageBitmap = this.props.imageBitmap || { width: 0, height: 0 };
        const { width, height } = this.closestDimensionsWithArea(this.props.pieceCount, imageBitmap.width, imageBitmap.height);

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
                    width={width * pieceSize}
                    height={height * pieceSize}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(OutputViewer);

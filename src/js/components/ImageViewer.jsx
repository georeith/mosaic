import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    imageBitmap: state.image,
    maxWidth: (state.image && state.image.width) || 0,
    maxHeight: (state.image && state.image.height) || 0,
});

class ImageViewer extends React.Component {
    static propTypes = {
        imageBitmap: React.PropTypes.object,
        maxWidth: React.PropTypes.number,
        maxHeight: React.PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            maskBounds: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
            dragging: false,
            dragOrigin: { x: 0, y: 0 },
            dragEnd: { x: 0, y: 0 },
            maxBounds: {
                left: 0,
                top: 0,
                right: props.maxWidth,
                bottom: props.maxHeight,
            },
        };
    }

    componentDidMount() {
        this.drawImage();
    }

    componentWillReceiveProps(nextProps) {
        const { maxWidth, maxHeight } = nextProps;
        this.setState({
            maskBounds: {
                left: 0,
                top: 0,
                right: maxWidth,
                bottom: maxHeight,
            },
            maxBounds: {
                left: 0,
                top: 0,
                right: maxWidth,
                bottom: maxHeight,
            },
        });
    }

    componentDidUpdate() {
        this.drawImage();
    }

    drawImage() {
        if (this.props.imageBitmap) {
            const context = this.canvas.getContext('2d');
            context.drawImage(this.props.imageBitmap, 0, 0);
        }
    }

    mouseDown = (event) => {
        event.preventDefault();
        const offset = this.mask.getBoundingClientRect();
        this.setState({
            dragOffset: { x: offset.left, y: offset.top },
            dragOrigin: { x: event.pageX, y: event.pageY },
        });
        document.addEventListener('mousemove', this.mouseMove, false);
        document.addEventListener('mouseup', this.mouseUp, false);
    }

    mouseMove = (event) => {
        const { dragOrigin, dragOffset } = this.state;
        const dragBounds = this.rectangleBetweenPoints(
            { x: dragOrigin.x - dragOffset.x, y: dragOrigin.y - dragOffset.y },
            { x: event.pageX - dragOffset.x, y: event.pageY - dragOffset.y },
        );
        const maskBounds = this.intersectRectangles(dragBounds, this.state.maxBounds);
        this.setState({ maskBounds });
    }

    mouseUp = () => {
        document.removeEventListener('mousemove', this.mouseMove, false);
        document.removeEventListener('mouseup', this.mouseUp, false);

        this.setState({ dragOrigin: { x: 0, y: 0 } });
    }

    rectangleBetweenPoints({ x: x1, y: y1 }, { x: x2, y: y2 }) {
        const left = Math.min(x1, x2);
        const top = Math.min(y1, y2);
        const right = Math.max(x1, x2);
        const bottom = Math.max(y1, y2);

        return { left, top, right, bottom };
    }

    intersectRectangles(rectangle1, rectangle2) {
        if (
            rectangle1.left >= rectangle2.right ||
            rectangle1.top >= rectangle2.bottom ||
            rectangle1.right <= rectangle2.left ||
            rectangle1.bottom <= rectangle2.top
        ) {
            return { left: 0, right: 0, top: 0, bottom: 0 };
        }
        return {
            left: Math.max(rectangle1.left, rectangle2.left),
            top: Math.max(rectangle1.top, rectangle2.top),
            right: Math.min(rectangle1.right, rectangle2.right),
            bottom: Math.min(rectangle1.bottom, rectangle2.bottom),
        };
    }

    render() {
        const { width, height } = this.props.imageBitmap || {
            width: 0,
            height: 0,
        };

        const { maskBounds } = this.state;

        return (
            <div
                onMouseDown={this.mouseDown}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'auto',
                    flexGrow: 1,
                    background: '#7F7F7F',
                }}>
                <div
                    style={{
                        width,
                        height,
                        position: 'relative',
                    }}>
                    <canvas
                        ref={canvas => { this.canvas = canvas; }}
                        width={width}
                        height={height}
                    />
                    <svg
                        ref={svg => { this.mask = svg; }}
                        viewBox={`0 0 ${width} ${height}`}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width,
                            height,
                        }}>
                        <defs>
                            <mask id="aperture">
                                <rect width={width} height={height} fill="white" />
                                <rect
                                    x={maskBounds.left}
                                    y={maskBounds.top}
                                    width={maskBounds.right - maskBounds.left}
                                    height={maskBounds.bottom - maskBounds.top}
                                />
                            </mask>
                        </defs>
                        <rect
                            width={width}
                            height={height}
                            fill="#000000"
                            fillOpacity={0.5}
                            mask="url(#aperture)"
                        />
                    </svg>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(ImageViewer);

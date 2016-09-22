import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    imageBitmap: state.image,
    maxBounds: state.image ? {
        left: 0,
        top: 0,
        right: state.image.width,
        bottom: state.image.height,
    } : {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
});

class ImageViewer extends React.Component {
    static propTypes = {
        imageBitmap: React.PropTypes.object,
        maxBounds: React.PropTypes.object,
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
            lockAspectRatio: false,
            dragOrigin: { x: 0, y: 0 },
            dragEnd: { x: 0, y: 0 },
        };
    }

    componentWillMount() {
        document.addEventListener('keydown', this.keyDown, false);
        document.addEventListener('keyup', this.keyUp, false);
    }

    componentDidMount() {
        this.drawImage();
    }

    componentWillReceiveProps(nextProps) {
        const { left, top, right, bottom } = nextProps.maxBounds;
        this.setState({ maskBounds: { left, top, right, bottom } });
    }

    componentDidUpdate() {
        this.drawImage();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDown, false);
        document.removeEventListener('keyup', this.keyUp, false);
    }

    drawImage() {
        if (this.props.imageBitmap) {
            const context = this.canvas.getContext('2d');
            context.drawImage(this.props.imageBitmap, 0, 0);
        }
    }

    keyDown = (event) => {
        if (event.key === 'Shift') {
            this.setState({ lockAspectRatio: true });
        }
    }

    keyUp = (event) => {
        if (event.key === 'Shift') {
            this.setState({ lockAspectRatio: false });
        }
    }

    marqueeDrawStart = (event) => {
        event.preventDefault();
        const offset = this.mask.getBoundingClientRect();
        this.setState({
            dragOffset: { x: offset.left, y: offset.top },
            dragOrigin: { x: event.pageX, y: event.pageY },
        });
        document.addEventListener('mousemove', this.marqueeDrawDrag, false);
        document.addEventListener('mouseup', this.marqueeDrawEnd, false);
    }

    marqueeDrawDrag = (event) => {
        const { dragOrigin, dragOffset } = this.state;
        const relativeDragStart = { x: dragOrigin.x - dragOffset.x, y: dragOrigin.y - dragOffset.y };
        const relativeDragEnd = { x: event.pageX - dragOffset.x, y: event.pageY - dragOffset.y };
        const dragBounds = this.rectangleBetweenPoints(
            relativeDragStart,
            relativeDragEnd
        );
        const { maxBounds } = this.props;
        const maskBounds = this.intersectRectangles(dragBounds, maxBounds);
        if (this.state.lockAspectRatio) {
            const width = maskBounds.right - maskBounds.left;
            const height = maskBounds.bottom - maskBounds.top;
            const positiveX = relativeDragStart.x <= relativeDragEnd.x;
            const positiveY = relativeDragStart.y <= relativeDragEnd.y;
            const maxWidth = positiveX
                ? maxBounds.right - maskBounds.left
                : maskBounds.right - maxBounds.left;
            const maxHeight = positiveY
                ? maxBounds.bottom - maskBounds.top
                : maskBounds.bottom - maxBounds.top;
            const length = Math.min(width, height, maxWidth, maxHeight);

            if (positiveX) {
                maskBounds.right = maskBounds.left + length;
            } else {
                maskBounds.left = maskBounds.right - length;
            }
            if (positiveY) {
                maskBounds.bottom = maskBounds.top + length;
            } else {
                maskBounds.top = maskBounds.bottom - length;
            }
        }
        this.setState({ maskBounds });
    }

    marqueeDrawEnd = () => {
        document.removeEventListener('mousemove', this.marqueeDrawDrag, false);
        document.removeEventListener('mouseup', this.marqueeDrawEnd, false);

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
        const maskHasBounds = maskBounds.left - maskBounds.right !== 0 && maskBounds.top - maskBounds.bottom !== 0;
        return (
            <div
                onMouseDown={this.marqueeDrawStart}
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
                            <filter id="dropshadow" height="130%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="3" /> {/* blur */}
                                <feOffset dx="0" dy="0" result="offsetblur" /> {/* offset */}
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <rect
                            width={width}
                            height={height}
                            fill="#000000"
                            fillOpacity={0.5}
                            mask="url(#aperture)"
                        />
                        <g visibility={maskHasBounds ? 'visible' : 'hidden'} style={{ filter: 'url(#dropshadow)' }}>
                            <rect
                                x={maskBounds.left}
                                y={maskBounds.top}
                                width={maskBounds.right - maskBounds.left}
                                height={maskBounds.bottom - maskBounds.top}
                                stroke="white"
                                strokeWidth="1"
                                fill="none"
                            />
                            <circle
                                id="north"
                                cx={(maskBounds.left + maskBounds.right) / 2}
                                cy={maskBounds.top}
                                fill="white"
                                r="4"
                            />
                            <circle
                                id="east"
                                cx={maskBounds.right}
                                cy={(maskBounds.top + maskBounds.bottom) / 2}
                                fill="white"
                                r="4"
                            />
                            <circle
                                id="south"
                                cx={(maskBounds.left + maskBounds.right) / 2}
                                cy={maskBounds.bottom}
                                fill="white"
                                r="4"
                            />
                            <circle
                                id="west"
                                cx={maskBounds.left}
                                cy={(maskBounds.top + maskBounds.bottom) / 2}
                                fill="white"
                                r="4"
                            />
                        </g>
                    </svg>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(ImageViewer);

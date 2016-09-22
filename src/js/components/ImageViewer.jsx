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
            marqueeBounds: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
            lockTranslate: false,
            lockAspectRatio: false,
            dragOrigin: { x: 0, y: 0 },
            dragEnd: { x: 0, y: 0 },
            lastDrag: { x: 0, y: 0 },
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
        this.setState({ marqueeBounds: { left, top, right, bottom } });
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
        let preventDefault = true;
        switch (event.key) {
            case 'Shift':
                this.setState({ lockAspectRatio: true });
                break;
            case ' ':
                this.setState({ lockTranslate: true });
                break;
            default:
                preventDefault = false;
                break;
        }
        if (preventDefault) event.preventDefault();
    }

    keyUp = (event) => {
        let preventDefault = true;
        switch (event.key) {
            case 'Shift':
                this.setState({ lockAspectRatio: false });
                break;
            case ' ':
                this.setState({ lockTranslate: false });
                break;
            default:
                preventDefault = false;
                break;
        }
        if (preventDefault) event.preventDefault();
    }

    drawMarquee = (origin, end) => {
        const totalBounds = this.rectangleBetweenPoints(origin, end);
        const { maxBounds } = this.props;
        const marqueeBounds = this.intersectRectangles(totalBounds, maxBounds);
        if (this.state.lockAspectRatio) {
            const width = marqueeBounds.right - marqueeBounds.left;
            const height = marqueeBounds.bottom - marqueeBounds.top;
            const positiveX = origin.x <= end.x;
            const positiveY = origin.y <= end.y;
            const maxWidth = positiveX
                ? maxBounds.right - marqueeBounds.left
                : marqueeBounds.right - maxBounds.left;
            const maxHeight = positiveY
                ? maxBounds.bottom - marqueeBounds.top
                : marqueeBounds.bottom - maxBounds.top;
            const length = Math.min(width, height, maxWidth, maxHeight);

            if (positiveX) {
                marqueeBounds.right = marqueeBounds.left + length;
            } else {
                marqueeBounds.left = marqueeBounds.right - length;
            }
            if (positiveY) {
                marqueeBounds.bottom = marqueeBounds.top + length;
            } else {
                marqueeBounds.top = marqueeBounds.bottom - length;
            }
        }
        this.setState({ marqueeBounds });
    }

    translateMarquee = ({ x = 0, y = 0 }) => {
        const { marqueeBounds } = this.state;
        const { maxBounds } = this.props;
        const minDelta = {
            x: maxBounds.left - marqueeBounds.left,
            y: maxBounds.top - marqueeBounds.top,
        };
        const maxDelta = {
            x: maxBounds.right - marqueeBounds.right,
            y: maxBounds.bottom - marqueeBounds.bottom,
        };
        const delta = {
            x: Math.min(Math.max(x, minDelta.x), maxDelta.x),
            y: Math.min(Math.max(y, minDelta.y), maxDelta.y),
        };
        this.setState({
            marqueeBounds: {
                left: marqueeBounds.left + delta.x,
                right: marqueeBounds.right + delta.x,
                top: marqueeBounds.top + delta.y,
                bottom: marqueeBounds.bottom + delta.y,
            },
        });
    }

    marqueeDragStart = (event) => {
        event.preventDefault();
        const offset = this.mask.getBoundingClientRect();
        this.setState({
            dragEnd: { x: offset.left, y: offset.top },
            dragOrigin: { x: event.pageX, y: event.pageY },
        });
        document.addEventListener('mousemove', this.marqueeDrag, false);
        document.addEventListener('mouseup', this.marqueeDragEnd, false);
    }

    marqueeDrag = (event) => {
        const { dragOrigin, dragEnd, lockTranslate } = this.state;
        if (lockTranslate) {
            const { lastDrag } = this.state;
            this.translateMarquee({ x: event.pageX - lastDrag.x, y: event.pageY - lastDrag.y });
        } else {
            const relativeDragOrigin = { x: dragOrigin.x - dragEnd.x, y: dragOrigin.y - dragEnd.y };
            const relativeDragEnd = { x: event.pageX - dragEnd.x, y: event.pageY - dragEnd.y };
            this.drawMarquee(relativeDragOrigin, relativeDragEnd);
        }
        this.setState({ lastDrag: { x: event.pageX, y: event.pageY } });
    }

    marqueeDragEnd = () => {
        document.removeEventListener('mousemove', this.marqueeDrag, false);
        document.removeEventListener('mouseup', this.marqueeDragEnd, false);

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

        const { marqueeBounds } = this.state;
        const maskHasBounds = marqueeBounds.left - marqueeBounds.right !== 0 && marqueeBounds.top - marqueeBounds.bottom !== 0;
        return (
            <div
                onMouseDown={this.marqueeDragStart}
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
                                    x={marqueeBounds.left}
                                    y={marqueeBounds.top}
                                    width={marqueeBounds.right - marqueeBounds.left}
                                    height={marqueeBounds.bottom - marqueeBounds.top}
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
                                x={marqueeBounds.left}
                                y={marqueeBounds.top}
                                width={marqueeBounds.right - marqueeBounds.left}
                                height={marqueeBounds.bottom - marqueeBounds.top}
                                stroke="white"
                                strokeWidth="1"
                                fill="none"
                            />
                            <circle
                                id="north"
                                cx={(marqueeBounds.left + marqueeBounds.right) / 2}
                                cy={marqueeBounds.top}
                                fill="white"
                                r="4"
                            />
                            <circle
                                id="east"
                                cx={marqueeBounds.right}
                                cy={(marqueeBounds.top + marqueeBounds.bottom) / 2}
                                fill="white"
                                r="4"
                            />
                            <circle
                                id="south"
                                cx={(marqueeBounds.left + marqueeBounds.right) / 2}
                                cy={marqueeBounds.bottom}
                                fill="white"
                                r="4"
                            />
                            <circle
                                id="west"
                                cx={marqueeBounds.left}
                                cy={(marqueeBounds.top + marqueeBounds.bottom) / 2}
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

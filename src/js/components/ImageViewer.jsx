import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ imageBitmap: state.image });

class ImageViewer extends React.Component {
    static propTypes = {
        imageBitmap: React.PropTypes.object,
    };

    componentDidMount() {
        this.drawImage();
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

export default connect(mapStateToProps)(ImageViewer);

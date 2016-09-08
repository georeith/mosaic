export default (state = null, action) => {
    switch (action.type) {
        case 'SET_IMAGE_BITMAP':
            return action.imageBitmap;

        default:
            return state;
    }
};

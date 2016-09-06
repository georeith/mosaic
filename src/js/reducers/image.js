export default (state = {}, action) => {
    switch (action.type) {
        case 'SET_IMAGE_SRC':
            return Object.assign({}, state, {
                imageSrc: action.imageSrc,
            });

        default:
            return state;
    }
};

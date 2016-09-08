const defaultState = {
    pieces: 2000,
    colors: 26,
};
export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_PIECES': {
            const count = Math.max(action.pieces, 2);
            return Object.assign({}, state, {
                pieces: count % 2 ? count + 1 : count,
            });
        }
        case 'SET_COLORS': {
            const colors = Math.max(action.colors, 1);
            return Object.assign({}, state, { colors });
        }
        default:
            return state;
    }
};

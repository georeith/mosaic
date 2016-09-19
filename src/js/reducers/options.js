const defaultState = {
    pieceCount: 2000,
    colorCount: 26,
    ditheringType: 'FloydSteinberg',
    serpentineDithering: false,
};
export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_PIECE_COUNT': {
            const pieceCount = Math.max(action.pieceCount, 1);
            return Object.assign({}, state, { pieceCount });
        }
        case 'SET_COLOR_COUNT': {
            const colorCount = Math.max(action.colorCount, 1);
            return Object.assign({}, state, { colorCount });
        }
        case 'SET_DITHERING_TYPE': {
            const { ditheringType } = action;
            return Object.assign({}, state, { ditheringType });
        }
        case 'SET_SERPENTINE_DITHERING': {
            const { serpentineDithering } = action;
            return Object.assign({}, state, { serpentineDithering });
        }
        default:
            return state;
    }
};

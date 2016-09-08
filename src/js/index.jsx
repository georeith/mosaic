import 'scss/base.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import imageReducer from '~/reducers/image';
import optionsReducer from '~/reducers/options';

import Sandbox from '~/components/Sandbox.jsx';

function App() {
    const reducers = combineReducers({
        image: imageReducer,
        options: optionsReducer,
    });
    const store = createStore(reducers);
    return (
        <Provider store={store}>
            <Sandbox />
        </Provider>
    );
}
render(<App />, document.getElementById('app'));

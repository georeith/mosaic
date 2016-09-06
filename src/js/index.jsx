import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import imageReducer from '~/reducers/image';

import Sandbox from '~/components/Sandbox.jsx';

function App() {
    const store = createStore(imageReducer);
    return (
        <Provider store={store}>
            <Sandbox />
        </Provider>
    );
}
render(<App />, document.getElementById('app'));

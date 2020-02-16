import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { withContext } from './AppContext';
import ItemsView from './components/ItemsView';

function App() {
    return (
        <ItemsView />
    );
}

export default withContext(App);

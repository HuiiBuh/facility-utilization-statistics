import React from 'react';
import './App.css';


class World extends React.Component {
    render() {
        return 'Hello World Two';
    }
}


function App() {
    return (
        <div>
            <p>Hello World</p>
            <World/>
        </div>
    );
}

export default App;


import React from 'react';
import ReactDOM from 'react-dom';


class HelloMessage extends React.Component {
    render() {
        return <div>Hallo {this.props.name}</div>;
    }
}


ReactDOM.render(<HelloMessage name="Niklas" />, document.getElementById('app'));

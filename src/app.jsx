import React from 'react';
import ReactDOM from 'react-dom';

import ServiceConfig from './serviceConfig.jsx';
import DataModel from './dataModel.jsx';
import Resolver from './resolver.jsx';

class App extends React.Component {
    render() {
        return (
            <div className="container">
                <ServiceConfig/>
                <div className="row">
                    <div className="col-lg-6">
                        <DataModel entity="Tasks"/>
                    </div>
                    <div className="col-lg-6">
                        <Resolver/>
                    </div>
                </div>
            </div>
        );
    }

}

ReactDOM.render(<App/>, document.getElementById('app'));

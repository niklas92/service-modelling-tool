import React from 'react';
import ReactDOM from 'react-dom';

import ServiceConfig from './serviceConfig.jsx';
import DataModel from './dataModel.jsx';
import Resolver from './resolver.jsx';

class App extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="divider-new">
                            <h2 className="h2-responsive">Construct the {this.props.modelName}</h2>
                        </div>
                        <ServiceConfig/>
                        <DataModel/>
                        <Resolver/>
                        <div>
                            <button type="submit" className="btn btn-default float-right">Generate Server</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

ReactDOM.render(<App modelName="Query Service Model"/>, document.getElementById('app'));

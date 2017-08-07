import React from 'react';
import ReactDOM from 'react-dom';

import ServiceConfig from './serviceConfig.jsx';
import DataModel from './dataModel.jsx';
import Resolver from './resolver.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {appName: ''};
        this.serviceModel = {
            serviceConfig: {},
            dataModel: {},
            resolvers: {}
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.setServiceConfig = this.setServiceConfig.bind(this);
    }

    setServiceConfig(serviceConfig){
        this.serviceModel.serviceConfig = serviceConfig;
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.serviceModel.serviceConfig.appName);
        console.log('Service Model:');
        console.log(JSON.stringify(this.serviceModel));
        event.preventDefault();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="divider-new">
                            <h2 className="h2-responsive">Construct the {this.props.modelName}</h2>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <ServiceConfig setServiceConfig={this.setServiceConfig}/>
                            <DataModel/>
                            {/*<Resolver/>*/}
                            <div>
                                <button type="submit" value="Submit" className="btn btn-default float-right">Generate Server</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

}

ReactDOM.render(<App modelName="Query Service Model"/>, document.getElementById('app'));

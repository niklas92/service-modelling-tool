import React from 'react';
import ReactDOM from 'react-dom';

import ServiceConfig from './serviceConfig.jsx';
import DataModel from './dataModel.jsx';
import Resolver from './resolver.jsx';

import CodeGenerator from '../actions/codeGenerator';
import ModelTransformer from '../actions/modelTransformer';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {appName: ''};
        this.serviceModel = {
            serviceConfig: {},
            dataModel: {},
            resolvers: {}
        };

        this.handleGenerateServer = this.handleGenerateServer.bind(this);
        this.setServiceConfig = this.setServiceConfig.bind(this);
    }

    setServiceConfig(serviceConfig){
        this.serviceModel.serviceConfig = serviceConfig;
    }

    //when user entered all fields and clicks on 'generate server' button
    handleGenerateServer(event) {
        //transform service model (PIM) to GraphQL model (PSM)
        var serverModel = ModelTransformer.transformToServerModel(this.serviceModel);
        var packageModel = ModelTransformer.transformToPackageModel(this.serviceModel);

        //transform from GraphQL model to code
        CodeGenerator.renderServerFile(serverModel, packageModel);
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
                        <form onSubmit={this.handleGenerateServer}>
                            <ServiceConfig setServiceConfig={this.setServiceConfig}/>
                            {/*<DataModel/>*/}
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

import React from 'react';
import ReactDOM from 'react-dom';

import ServiceConfig from './serviceConfig.jsx';
import DataModel from './dataModel.jsx';
import ResolversModel from './resolversModel.jsx';

import CodeGenerator from '../actions/codeGenerator';
import ModelTransformer from '../actions/modelTransformer';

//needed for select of material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {appName: ''};
        this.serviceModel = {
            serviceConfig: {},
            dataModel: {},
            resolvers: {}
        };

        //needed for select of material-ui
        injectTapEventPlugin();

        this.handleGenerateServer = this.handleGenerateServer.bind(this);
        this.setServiceConfig = this.setServiceConfig.bind(this);
        this.setDataModel = this.setDataModel.bind(this);
        this.setResolversModel = this.setResolversModel.bind(this);
    }

    setServiceConfig(serviceConfig){
        this.serviceModel.serviceConfig = serviceConfig;
    }

    setDataModel(dataModel){
        this.serviceModel.dataModel = dataModel;
        console.log("serviceModel.dataModel: " + JSON.stringify(this.serviceModel.dataModel));
    }

    setResolversModel(resolversModel){
        this.serviceModel.resolvers = resolversModel;
        console.log("serviceModel.resolvers: " + JSON.stringify(this.serviceModel.resolvers));
    }

    //when user entered all fields and clicks on 'generate server' button
    handleGenerateServer(event) {
        console.log("serviceModel: " + JSON.stringify(this.serviceModel));

        //transform service model (PIM) to GraphQL model (PSM)
        var gqlModel = ModelTransformer.transformToGraphQLModel(this.serviceModel);

        //transform from GraphQL model to code
        CodeGenerator.renderServerFile(gqlModel);
        event.preventDefault();
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="divider-new">
                                <h2 className="h2-responsive">Construct the {this.props.modelName}</h2>
                            </div>
                            <form onSubmit={this.handleGenerateServer}>
                                <ServiceConfig setServiceConfig={this.setServiceConfig}/>
                                <DataModel setDataModel={this.setDataModel}/>
                                <ResolversModel setResolversModel={this.setResolversModel}/>
                                <div>
                                    <button type="submit" value="Submit" className="btn btn-default float-right">Generate Server</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }

}

ReactDOM.render(<App modelName="Query Service Model"/>, document.getElementById('app'));

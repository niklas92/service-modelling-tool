import React from 'react';


class ServiceConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {appName: '', port: '', modelChangesSubmitted: true};

        this.handleAppNameChange = this.handleAppNameChange.bind(this);
        this.handlePortChange = this.handlePortChange.bind(this);
        this.saveServiceConfig = this.saveServiceConfig.bind(this);
    }

    handleAppNameChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({appName: event.target.value});
    }

    handlePortChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({port: event.target.value});
    }

    saveServiceConfig() {
        this.setState({modelChangesSubmitted: true});
        this.props.setServiceConfig(this.state);
    }

    render() {
        return (
            <div className="widget-wrapper">
                <h3>Service Model</h3><br/>
                <div className="card">
                    <div className="card-block">

                        <h4 className="card-title">Define Server</h4>
                        <p>Define the specification of the GraphQL server (make sure to specify schema and resolvers before)</p>

                        <div className="md-form">
                            <input value={this.state.appName} onChange={this.handleAppNameChange} type="text" className="form-control"/>
                            <label htmlFor="appName">Application name</label>
                        </div>

                        <div className="md-form">
                            <input value={this.state.port} onChange={this.handlePortChange} type="text" className="form-control"/>
                            <label htmlFor="port">Port</label>
                        </div>

                        <div>
                            <button onClick={this.saveServiceConfig} type="button" disabled={this.state.modelChangesSubmitted} className="btn btn-default float-right">OK</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default ServiceConfig;

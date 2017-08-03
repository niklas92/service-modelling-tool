import React from 'react';


class ServiceConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {appName: '', port: ''};

        this.handleAppNameChange = this.handleAppNameChange.bind(this);
        this.handlePortChange = this.handlePortChange.bind(this);
        this.saveServiceConfig = this.saveServiceConfig.bind(this);
    }

    handleAppNameChange(event) {
        this.setState({appName: event.target.value});
    }

    handlePortChange(event) {
        this.setState({port: event.target.value});
    }

    saveServiceConfig() {
        console.log("in serviceConfig");
        this.props.setServiceConfig(this.state);
        console.log(this.state);
    }

    render() {
        return (
            <div className="widget-wrapper">
                <h4>Service Model</h4><br/>
                <div className="card">
                    <div className="card-block">
                        <p><strong>Define Server</strong></p>
                        <p>Define the specification of the GraphQL server (make sure to specify schema and resolvers before)</p>

                            <div className="md-form">
                                <input value={this.state.appName} onChange={this.handleAppNameChange} type="text" className="form-control"/>
                                <label htmlFor="appName">Application Name</label>
                            </div>
                            <div className="md-form">
                                <input value={this.state.port} onChange={this.handlePortChange} type="text" className="form-control"/>
                                <label htmlFor="port">Port</label>
                            </div>
                            <div>
                                <button onClick={this.saveServiceConfig} className="btn btn-default float-right">OK</button>
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ServiceConfig;

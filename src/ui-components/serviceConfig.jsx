import React from 'react';


class ServiceConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {appName: '', description: '', author:'', port: '8080', modelChangesSubmitted: true};

        this.handleAppNameChange = this.handleAppNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handlePortChange = this.handlePortChange.bind(this);
        this.saveServiceConfig = this.saveServiceConfig.bind(this);
    }

    handleAppNameChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({appName: event.target.value});
    }

    handleDescriptionChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({description: event.target.value});
    }

    handleAuthorChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({author: event.target.value});
    }

    handlePortChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({port: event.target.value});
    }

    saveServiceConfig() {
        if(this.state.appName == '' || this.state.port == ''){
            alert('Please fill out all required fields');
        }else{
            this.setState({modelChangesSubmitted: true});
            this.props.setServiceConfig(this.state);
        }
    }

    render() {
        return (
            <div className="widget-wrapper">
                <h3>Service Model</h3><br/>
                <div className="card">
                    <div className="card-block">

                        <h4 className="card-title">Define Server</h4>

                        <div className="md-form">
                            <input value={this.state.appName} onChange={this.handleAppNameChange} type="text" className="form-control"/>
                            <label>Application name *</label>
                        </div>

                        <div className="md-form">
                            <input value={this.state.author} onChange={this.handleAuthorChange} type="text" className="form-control"/>
                            <label>Author name</label>
                        </div>

                        <div className="md-form">
                            <label>Port *</label>
                            <input value={this.state.port} onChange={this.handlePortChange} type="number" className="form-control has-hint"/>
                            <div className="hint">The localhost port where the generated server will run.</div>
                        </div>

                        <div className="md-form">
                            <textarea value={this.state.description} onChange={this.handleDescriptionChange} type="text" className="md-textarea"></textarea>
                            <label>Application description</label>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <div className="descriptionText reqDescription">* required field</div>
                            </div>
                            <div className="col-6">
                                <button onClick={this.saveServiceConfig} type="button" disabled={this.state.modelChangesSubmitted} className="btn btn-default float-right">OK</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default ServiceConfig;

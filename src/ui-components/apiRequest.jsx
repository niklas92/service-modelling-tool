import React from 'react';
import {find, findIndex} from 'lodash';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


class APIRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            httpMethod: 'GET',
            body: '',
            authentication: {
                username: '',
                password: ''
            },
            parameters: [],
            parameterName: '',
            parameterValue: '',
            parameterType: 'Header'
        };

        this.handleURLChange = this.handleURLChange.bind(this);
        this.handleHTTPMethodChange = this.handleHTTPMethodChange.bind(this);
        this.handleBodyChange = this.handleBodyChange.bind(this);
        this.handleAuthUsernameChange = this.handleAuthUsernameChange.bind(this);
        this.handleAuthPasswordChange = this.handleAuthPasswordChange.bind(this);
        this.handleParameterNameChange = this.handleParameterNameChange.bind(this);
        this.handleParameterValueChange = this.handleParameterValueChange.bind(this);
        this.handleParameterTypeChange = this.handleParameterTypeChange.bind(this);
        this.addParameter = this.addParameter.bind(this);
        this.deleteParameter = this.deleteParameter.bind(this);
        this.deleteAPIRequest = this.deleteAPIRequest.bind(this);
    }

    handleURLChange(event) {
        this.setState({url: event.target.value}, function(){
            this.saveAPIRequest();
        });
    }

    handleHTTPMethodChange(event, index, value) {
        this.setState({httpMethod: value}, function(){
            this.saveAPIRequest();
        });
    }

    handleBodyChange(event) {
        this.setState({body: event.target.value}, function(){
            this.saveAPIRequest();
        });
    }

    handleAuthUsernameChange(event) {
        let auth = Object.assign({}, this.state.authentication);
        auth.username = event.target.value;
        this.setState({authentication: auth}, function(){
            this.saveAPIRequest();
        });
    }

    handleAuthPasswordChange(event) {
        let auth = Object.assign({}, this.state.authentication);
        auth.password = event.target.value;
        this.setState({authentication: auth}, function(){
            this.saveAPIRequest();
        });
    }

    handleParameterNameChange(event) {
        this.setState({parameterName: event.target.value});
    }

    handleParameterValueChange(event) {
        this.setState({parameterValue: event.target.value});
    }

    handleParameterTypeChange(event, index, value) {
        this.setState({parameterType: value});
    }

    addParameter(){
        var parName = this.state.parameterName;
        var parValue = this.state.parameterValue;
        var type = this.state.parameterType;
        var parameters = this.state.parameters;

        //create id
        var parId = 0;
        if(parameters.length > 0){
            parId = parameters[parameters.length-1].parameterId +1;
        }

        //add new parameter
        parameters.push({parameterId: parId, parameterName: parName, parameterValue: parValue, type: type});

        this.setState({parameters: parameters});
        this.setState({parameterName: ''});
        this.setState({parameterValue: ''});
        this.setState({parameterType: ''});

        this.saveAPIRequest();
    }

    deleteParameter(event) {
        var parameters = this.state.parameters;
        var index = findIndex(parameters, {parameterId: parseInt(event.target.value)});

        if(index >= 0) {
            parameters.splice(index, 1);
            this.setState({parameters: parameters});
        }

        this.saveAPIRequest();
    }

    saveAPIRequest(){
        var apiRequest = {
            requestId: this.props.requestId,
            url: this.state.url,
            httpMethod: this.state.httpMethod,
            body: this.state.body,
            authentication: this.state.authentication,
            parameters: this.state.parameters
        };
        this.props.saveRequest(apiRequest);
    }

    deleteAPIRequest() {
        this.props.deleteRequest(this.props.requestId);
    }

    render() {
        var scope = this;
        return (
            <div>
                <button onClick={this.deleteAPIRequest} type="button" className="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <p><strong>API Request {this.props.requestId+1}</strong></p>

                <div value={this.state.url} onChange={this.handleURLChange} className="md-form">
                    <label>URL *</label>
                    <input type="text" className="form-control has-hint"/>
                    <div className="hint">Indicate variable URI parameters with {'{}'} (e.g. person/{'{'}personId{'}'}).</div>
                </div>

                <SelectField
                    floatingLabelText="HTTP method"
                    value={this.state.httpMethod}
                    onChange={this.handleHTTPMethodChange}
                    className="md-form"
                    floatingLabelStyle={{color: '#757575'}}
                    selectedMenuItemStyle={{color: '#4285F4'}}
                    underlineStyle={{borderColor: '#CBCBCB'}}
                    underlineFocusStyle={{borderColor: '#4285F4'}}
                    style={{width: '100%'}}>
                    <MenuItem value="GET" primaryText="GET" />
                    <MenuItem value="POST" primaryText="POST" />
                    <MenuItem value="PUT" primaryText="PUT" />
                    <MenuItem value="DELETE" primaryText="DELETE" />
                </SelectField>

                <div value={this.state.body} onChange={this.handleBodyChange} className="md-form">
                    <input type="text" className="form-control"/>
                    <label>Request body</label>
                </div>

                <p>Authentication</p>
                <div className="row">
                    <div className="col-md-6">
                        <div value={this.state.authentication.username} onChange={this.handleAuthUsernameChange} className="md-form">
                            <label>Username</label>
                            <input type="text" className="form-control has-hint"/>
                            <div className="hint">Use ' ' for string values. Considered as parameter name otherwise.</div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div value={this.state.authentication.password} onChange={this.handleAuthPasswordChange} className="md-form">
                            <label>Password</label>
                            <input type="text" className="form-control has-hint"/>
                            <div className="hint">Use ' ' for string values. Considered as parameter name otherwise.</div>
                        </div>
                    </div>
                </div>

                <p>Parameters (query and header)</p>

                <table className="table table-sm">

                    <thead className="blue-grey lighten-4">
                    <tr className="text-white">
                        <th>Parameter name</th>
                        <th>Parameter value</th>
                        <th>In</th>
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {
                        this.state.parameters.map(function(par) {
                            return (
                                <tr key={par.parameterId}>
                                    <td>{par.parameterName}</td>
                                    <td>{par.parameterValue}</td>
                                    <td>{par.type}</td>
                                    <td><button value={par.parameterId} onClick={scope.deleteParameter} type="button" className="btn btn-sm">Delete</button></td>
                                </tr>
                            );
                        })
                    }

                    <tr>
                        <td key='input'>
                            <input value={this.state.parameterName} onChange={this.handleParameterNameChange} type="text" className="form-control"/>
                        </td>
                        <td>
                            <input value={this.state.parameterValue} onChange={this.handleParameterValueChange} type="text" className="form-control has-hint"/>
                            <div className="hint">Use ' ' for string values.</div>
                        </td>
                        <td>
                            <SelectField
                                value={this.state.parameterType}
                                onChange={this.handleParameterTypeChange}
                                selectedMenuItemStyle={{color: '#4285F4'}}
                                underlineStyle={{borderColor: '#CBCBCB'}}
                                underlineFocusStyle={{borderColor: '#4285F4'}}
                                style={{verticalAlign: 'bottom', marginTop: '5px'}}>
                                <MenuItem value="Header" primaryText="Header"/>
                                <MenuItem value="Query" primaryText="Query"/>
                            </SelectField>
                        </td>
                        <td>
                            <button onClick={this.addParameter} type="button" className="btn btn-sm">Add</button>
                        </td>
                    </tr>

                    </tbody>
                </table>

            </div>
        );
    }
}

export default APIRequest;

import React from 'react';
import {find, findIndex} from 'lodash';
import APIRequest from './apiRequest.jsx';

class ResolverEntity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resolverName: '',
            returnType: '',
            arguments: [],
            apiRequests: [],
            argumentName: '',
            argumentType: '',
            modelChangesSubmitted: true
        };

        this.handleResolverNameChange = this.handleResolverNameChange.bind(this);
        this.handleReturnTypeChange = this.handleReturnTypeChange.bind(this);
        this.handleArgumentNameChange = this.handleArgumentNameChange.bind(this);
        this.handleArgumentTypeChange = this.handleArgumentTypeChange.bind(this);
        this.addArgument = this.addArgument.bind(this);
        this.deleteArgument = this.deleteArgument.bind(this);
        this.saveResolver = this.saveResolver.bind(this);
        this.deleteResolver = this.deleteResolver.bind(this);
        this.newAPIRequest = this.newAPIRequest.bind(this);
        this.saveAPIRequest = this.saveAPIRequest.bind(this);
        this.deleteAPIRequest = this.deleteAPIRequest.bind(this);
    }


    handleResolverNameChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({resolverName: event.target.value});
    }

    handleReturnTypeChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({returnType: event.target.value});
    }

    handleArgumentNameChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({argumentName: event.target.value});
    }

    handleArgumentTypeChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({argumentType: event.target.value});
    }

    addArgument(){
        this.setState({modelChangesSubmitted: false});
        var argName = this.state.argumentName;
        var argType = this.state.argumentType;
        var args = this.state.arguments;

        //create id
        var argId = 0;
        if(args.length > 0){
            argId = args[args.length-1].argumentId +1;
        }

        //add new parameter
        args.push({argumentId: argId, argumentName: argName, argumentType: argType});

        this.setState({arguments: args});
        this.setState({argumentName: ''});
        this.setState({argumentType: ''});
    }

    deleteArgument(event) {
        this.setState({modelChangesSubmitted: false});
        var args = this.state.arguments;
        var index = findIndex(args, {argumentId: parseInt(event.target.value)});

        if(index >= 0) {
            args.splice(index, 1);
            this.setState({arguments: args});
        }
    }

    saveResolver() {
        if(this.state.resolverName == '' || this.state.returnType == ''){
            alert('Please fill out all required fields');
        }else {
            this.setState({modelChangesSubmitted: true});
            var resolver = {
                resolverId: this.props.resolverId,
                resolverName: this.state.resolverName,
                returnType: this.state.returnType,
                arguments: this.state.arguments,
                apiRequests: this.state.apiRequests
            };
            this.props.saveResolver(resolver);
        }
    }

    deleteResolver() {
        this.props.deleteResolver(this.props.resolverId);
    }

    newAPIRequest() {
        var requestsArray = this.state.apiRequests;

        //create id
        var reqId = 0;
        if(requestsArray.length > 0){
            reqId = requestsArray[requestsArray.length-1].requestId +1;
        }

        //add new entity
        requestsArray.push({
            requestId: reqId,
            url: '',
            httpMethod: '',
            body: '',
            parameters: []
        });

        this.setState({apiRequests: requestsArray});
    }

    saveAPIRequest(apiReq) {
        this.setState({modelChangesSubmitted: false});
        var requestsArray = this.state.apiRequests;
        var index = findIndex(requestsArray, {requestId: apiReq.requestId});

        if(index >= 0) {
            //replace old apiRequest with new one
            requestsArray.splice(index, 1, apiReq);
            this.setState({apiRequests: requestsArray});
        }
    }

    deleteAPIRequest(reqId) {
        this.setState({modelChangesSubmitted: false});
        var requestsArray = this.state.apiRequests;
        var index = findIndex(requestsArray, {requestId: reqId});

        if(index >= 0) {
            //remove request from array and update state
            requestsArray.splice(index, 1);
            this.setState({apiRequests: requestsArray});
        }
    }

    render() {
        var scope = this;
        return (
            <div className="card">
                <div className="card-block">

                    <button onClick={this.deleteResolver} type="button" className="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 className="card-title">Resolver {this.props.resolverId+1}</h4>
                    <br/>

                    <div className="md-form">
                        <input value={this.state.resolverName} onChange={this.handleResolverNameChange} type="text" className="form-control"/>
                        <label>Resolver name *</label>
                    </div>

                    <div className="md-form">
                        <input value={this.state.returnType} onChange={this.handleReturnTypeChange} type="text" className="form-control"/>
                        <label>Return type *</label>
                    </div>

                    <p><strong>Arguments</strong></p>

                    <table className="table table-sm">

                        <thead className="blue-grey table-head">
                        <tr className="text-white">
                            <th>Argument name</th>
                            <th>Argument type</th>
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {
                            this.state.arguments.map(function(arg) {
                                return (
                                    <tr key={arg.argumentId}>
                                        <td>{arg.argumentName}</td>
                                        <td>{arg.argumentType}</td>
                                        <td><button value={arg.argumentId} onClick={scope.deleteArgument} type="button" className="btn btn-sm">Delete</button></td>
                                    </tr>
                                );
                            })
                        }

                        <tr>
                            <td key='input'>
                                <input value={this.state.argumentName} onChange={this.handleArgumentNameChange} type="text" className="form-control"/>
                            </td>
                            <td>
                                <input value={this.state.argumentType} onChange={this.handleArgumentTypeChange} type="text" className="form-control"/>
                            </td>
                            <td>
                                <button onClick={this.addArgument} type="button" className="btn btn-sm">Add</button>
                            </td>
                        </tr>

                        </tbody>
                    </table>

                    {
                        this.state.apiRequests.map(function(req) {
                            return (
                                <div key={req.requestId}>
                                    <APIRequest saveRequest={scope.saveAPIRequest} deleteRequest={scope.deleteAPIRequest} requestId={req.requestId}/>
                                    <br/>
                                </div>
                            );
                        })
                    }

                    <div>
                        <button onClick={this.newAPIRequest} type="button" className="btn btn-sm">Add API Request</button>
                    </div>


                    <div className="row">
                        <div className="col-6">
                            <div className="descriptionText reqDescription">* required field</div>
                        </div>
                        <div className="col-6">
                            <button onClick={this.saveResolver} type="button" disabled={this.state.modelChangesSubmitted} className="btn btn-default float-right">OK</button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default ResolverEntity;

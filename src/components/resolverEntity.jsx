import React from 'react';
import {find, findIndex} from 'lodash';

class ResolverEntity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resolverName: '',
            returnType: '',
            arguments: [],
            apiRequest: {},
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
        this.addHeaderParameter = this.addHeaderParameter.bind(this);
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
        this.setState({modelChangesSubmitted: true});
        var resolver = {
            resolverId: this.props.resolverId,
            resolverName: this.state.resolverName,
            returnType: this.state.returnType,
            arguments: this.state.arguments
        };
        this.props.saveResolver(resolver);
    }

    deleteResolver() {
        this.props.deleteResolver(this.props.resolverId);
    }

    addHeaderParameter() {
        console.log('Add a new header parameter');
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
                        <label>Resolver name</label>
                    </div>

                    <div className="md-form">
                        <input value={this.state.returnType} onChange={this.handleReturnTypeChange} type="text" className="form-control"/>
                        <label>Return type</label>
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

                    <p><strong>API Request</strong></p>
                    <p>Define an API request</p>

                    <div className="md-form">
                        <input type="text" className="form-control"/>
                        <label>URL</label>
                    </div>

                    <div className="md-form">
                        <input name="parName" type="text" className="form-control"/>
                        <label>HTTP method</label>
                    </div>

                    <div className="row">
                        <div className="col-lg-6">
                            <div className="md-form">
                                <input name="parName" type="text" className="form-control"/>
                                <label>Header parameter name</label>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="md-form">
                                <input name="parType" type="text" className="form-control"/>
                                <label>Header parameter type</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button onClick={this.addHeaderParameter} type="button" className="btn btn-sm">Add Header Parameter</button>
                    </div>
                    <div>
                        <button type="button" className="btn btn-default">Add Authentication</button>
                    </div>


                    <div>
                        <button onClick={this.saveResolver} type="button" disabled={this.state.modelChangesSubmitted} className="btn btn-default float-right">OK</button>
                    </div>

                </div>
            </div>
        );
    }
}

export default ResolverEntity;

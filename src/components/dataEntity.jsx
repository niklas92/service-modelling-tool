import React from 'react';


class DataEntity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {entityName: '', parameters: [], parameterName: '', parameterType: '', modelChangesSubmitted: true};

        this.handleEntityNameChange = this.handleEntityNameChange.bind(this);
        this.handleParameterNameChange = this.handleParameterNameChange.bind(this);
        this.handleParameterTypeChange = this.handleParameterTypeChange.bind(this);
        this.addParameter = this.addParameter.bind(this);
        this.deleteParameter = this.deleteParameter.bind(this);
        this.saveDataEntity = this.saveDataEntity.bind(this);
        this.deleteDataEntity = this.deleteDataEntity.bind(this);
    }

    handleEntityNameChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({entityName: event.target.value});
    }

    handleParameterNameChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({parameterName: event.target.value});
    }

    handleParameterTypeChange(event) {
        this.setState({modelChangesSubmitted: false});
        this.setState({parameterType: event.target.value});
    }

    addParameter(){
        this.setState({modelChangesSubmitted: false});
        var parName = this.state.parameterName;
        var parType = this.state.parameterType;
        var parameters = this.state.parameters;

        //create id
        var parId = 0;
        if(parameters.length > 0){
            parId = parameters[parameters.length-1].parameterId +1;
        }

        //add new parameter
        parameters.push({parameterId: parId, parameterName: parName, parameterType: parType});

        this.setState({parameters: parameters});
        this.setState({parameterName: ''});
        this.setState({parameterType: ''});
    }

    deleteParameter(event) {
        this.setState({modelChangesSubmitted: false});
        var parameters = this.state.parameters;
        var index;

        for(var p in parameters)
            if (event.target.value == parameters[p].parameterId)
                index = p;

        if(index)
            parameters.splice(index, 1);

        this.setState({parameters: parameters});
    }

    saveDataEntity() {
        this.setState({modelChangesSubmitted: true});
        var entity = {
            entityId: this.props.entityId,
            entityName: this.state.entityName,
            parameters: this.state.parameters
        };
        this.props.saveEntity(entity);
    }

    deleteDataEntity() {
        this.props.deleteEntity(this.props.entityId);
    }

    render() {
        var scope = this;
        return (
            <div className="card">
                <div className="card-block">

                    <button onClick={this.deleteDataEntity} type="button" className="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 className="card-title">Entity {this.props.entityId+1}</h4>
                    <br/>

                    <div className="md-form">
                        <input value={this.state.appName} onChange={this.handleEntityNameChange} type="text" className="form-control"/>
                        <label>Entity name</label>
                    </div>

                    <br/>

                    <p><strong>Parameters</strong></p>

                    <table className="table table-sm">

                        <thead className="blue-grey table-head">
                        <tr className="text-white">
                            <th>Parameter name</th>
                            <th>Parameter type</th>
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {
                            this.state.parameters.map(function(param) {
                                return (
                                    <tr key={param.parameterId}>
                                        <td>{param.parameterName}</td>
                                        <td>{param.parameterType}</td>
                                        <td><button value={param.parameterId} onClick={scope.deleteParameter} type="button" className="btn btn-sm">Delete</button></td>
                                    </tr>
                                );
                            })
                        }

                        <tr>
                            <td key='input'>
                                <input value={this.state.parameterName} onChange={this.handleParameterNameChange} type="text" className="form-control"/>
                            </td>
                            <td>
                                <input value={this.state.parameterType} onChange={this.handleParameterTypeChange} type="text" className="form-control"/>
                            </td>
                            <td>
                                <button onClick={this.addParameter} type="button" className="btn btn-sm">Add</button>
                            </td>
                        </tr>

                        </tbody>
                    </table>

                    <div>
                        <button onClick={this.saveDataEntity} type="button" disabled={this.state.modelChangesSubmitted} className="btn btn-default float-right">OK</button>
                    </div>

                </div>
            </div>
        );
    }
}

export default DataEntity;
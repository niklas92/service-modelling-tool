import React from 'react';
import {find, findIndex} from 'lodash';
import DataEntity from './dataEntity.jsx';

class DataModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {entities: [{
            entityId: 0,
            entityName: '',
            parameters: []
        }]};

        this.saveDataEntity = this.saveDataEntity.bind(this);
        this.deleteDataEntity = this.deleteDataEntity.bind(this);
        this.newDataEntity = this.newDataEntity.bind(this);
    }

    newDataEntity(){
        var entityArray = this.state.entities;

        //create id
        var eId = 0;
        if(entityArray.length > 0){
            eId = entityArray[entityArray.length-1].entityId +1;
        }

        //add new entity
        entityArray.push({entityId: eId, entityName: '', parameters: []});

        this.setState({entities: entityArray});
    }

    saveDataEntity(entity) {
        var entityArray = this.state.entities;
        var index = findIndex(entityArray, {entityId: entity.entityId});

        if(index >= 0) {
            //replace old entity with new one
            entityArray.splice(index, 1, entity);
            this.setState({entities: entityArray});

            //update data model in app component
            this.props.setDataModel(entityArray);
        }
    }

    deleteDataEntity(entityId) {
        var entityArray = this.state.entities;
        var index = findIndex(entityArray, {entityId: entityId});

        if(index >= 0) {
            entityArray.splice(index, 1);
            this.setState({entities: entityArray});

            //update data model in app component
            this.props.setDataModel(entityArray);
        }
    }

    render() {
        var scope = this;
        return (
            <div className="widget-wrapper">
                <h3>Data Model</h3><br/>
                {
                    this.state.entities.map(function(entity) {
                        return (
                            <div key={entity.entityId}>
                                <DataEntity saveEntity={scope.saveDataEntity} deleteEntity={scope.deleteDataEntity} entityId={entity.entityId}/>
                                <br/>
                            </div>
                        );
                    })
                }
                <div>
                    <button onClick={this.newDataEntity} type="button" className="btn">Add Entity</button>
                </div>
            </div>
        );
    }
}

export default DataModel;

import React from 'react';
import {find, findIndex} from 'lodash';
import ResolverEntity from './resolverEntity.jsx';


class ResolversModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {resolvers: [{
            resolverId: 0,
            resolverName: '',
            returnType: '',
            arguments: [],
            apiRequest: {}
        }]};

        this.saveResolverEntity = this.saveResolverEntity.bind(this);
        this.deleteResolverEntity = this.deleteResolverEntity.bind(this);
        this.newResolverEntity = this.newResolverEntity.bind(this);
    }

    newResolverEntity(){
        var resolverArray = this.state.resolvers;

        //create id
        var rId = 0;
        if(resolverArray.length > 0){
            rId = resolverArray[resolverArray.length-1].resolverId +1;
        }

        //add new entity
        resolverArray.push({
            resolverId: rId,
            resolverName: '',
            returnType: '',
            arguments: [],
            apiRequest: {}
        });

        this.setState({resolvers: resolverArray});
    }

    saveResolverEntity(resolver) {
        var resolverArray = this.state.resolvers;
        var index = findIndex(resolverArray, {resolverId: resolver.resolverId});

        if(index >= 0) {
            //replace old resolver entity with new one
            resolverArray.splice(index, 1, resolver);
            this.setState({resolvers: resolverArray});

            //update resolvers model in app component
            this.props.setResolversModel(resolverArray);
        }
    }

    deleteResolverEntity(resolverId) {
        var resolversArray = this.state.resolvers;
        var index = findIndex(resolversArray, {resolverId: resolverId});

        if(index >= 0) {
            //remove resolver from array and update state
            resolversArray.splice(index, 1);
            this.setState({resolvers: resolversArray});

            //update resolvers model in app component
            this.props.setResolversModel(resolversArray);
        }
    }

    render() {
        var scope = this;
        return (
            <div className="widget-wrapper">
                <h3>Resolver</h3><br/>
                {
                    this.state.resolvers.map(function(resolver) {
                        return (
                            <div key={resolver.resolverId}>
                                <ResolverEntity saveResolver={scope.saveResolverEntity} deleteResolver={scope.deleteResolverEntity} resolverId={resolver.resolverId}/>
                                <br/>
                            </div>
                        );
                    })
                }
                <div>
                    <button onClick={this.newResolverEntity} type="button" className="btn">Add Resolver</button>
                </div>
            </div>
        );
    }
}

export default ResolversModel;

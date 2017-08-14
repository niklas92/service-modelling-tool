import Mustache from 'mustache';
import resolverSingleReq from './mustache-templates/resolverSingleReq.mustache';

exports.transformToGraphQLModel = function (serviceModel) {

    var gqlModel = {
        serverModel: transformToServerModel(serviceModel),
        packageModel: transformToPackageModel(serviceModel),
        schemaModel: transformToSchemaModel(serviceModel),
        resolversModel: transformToResolversModel(serviceModel)
    };

    return gqlModel;
};

var transformToServerModel = function (serviceModel) {

    var serverModel = {
        port: serviceModel.serviceConfig.port
    };

    return serverModel;
};

var transformToPackageModel = function (serviceModel) {

    var packageModel = {
        appName: serviceModel.serviceConfig.appName,
        author: serviceModel.serviceConfig.author,
        description: serviceModel.serviceConfig.description
    };

    return packageModel;
};

var transformToSchemaModel = function (serviceModel){
    var dataModelString = '';

    //construct the data model for the schema
    var entities = serviceModel.dataModel;
    for(var e in entities){
        var entity = entities[e];
        dataModelString += 'type ' + entity.entityName + ' { \n';

        for(var p in entity.parameters){
            dataModelString += '   ' + entity.parameters[p].parameterName + ': ' + entity.parameters[p].parameterType + '\n';
        }

        dataModelString += '}\n';
    }

    var queryString = '';
    var mutationString = '';

    //construct the resolver model for the schema
    var resolvers = serviceModel.resolvers;
    for(var r in resolvers){
        var resolver = resolvers[r];
        if(resolver.apiRequests[0].httpMethod == 'GET'){
            queryString += '\n    ' + constructSchemaResolver(resolver);
        }else{
            mutationString += '\n    ' + constructSchemaResolver(resolver);
        }

    }

    var schemaModel = {
        dataModel: dataModelString,
        queries: queryString,
        mutations: mutationString
    };

    return schemaModel;
};

var constructSchemaResolver =  function (resolverModel){
    var schemaResolver = resolverModel.resolverName;

    //if resolver has arguments add each arg in function e.g. (id: Int, name: String)
    if(resolverModel.arguments.length > 0){
        schemaResolver += '(';

        for(var a in resolverModel.arguments){
            if(a>0)
                schemaResolver += ', ';
            var arg = resolverModel.arguments[a];
            schemaResolver += arg.argumentName + ': ' + arg.argumentType;
        }

        schemaResolver += ')';
    }
    schemaResolver += ': ' + resolverModel.returnType;

    return schemaResolver;
};

var transformToResolversModel = function (serviceModel){

    var resolvers = serviceModel.resolvers;

    var queriesString = '';
    var mutationsString = '';

    //create functions for every resolver
    // and store them either in the queries- or mutations string
    for(var r in resolvers){
        var resolver = resolvers[r];

        var resolverFunction = makeResolverFunction(resolver);

        if(resolver.apiRequests[0].httpMethod == "GET"){
            queriesString += '\n        ' + resolverFunction + ',';
        }else{
            mutationsString += '\n      ' + resolverFunction + ',';
        }

    }


    var resolversModel = {
        queries: queriesString,
        mutations: mutationsString
    };

    console.log('resolversModel: ' + JSON.stringify(resolversModel));

    return resolversModel;
};

var makeResolverFunction = function (resolver){

    var args = '';
    for(var a in resolver.arguments){
        if(a>0)
            args += ', ';
        args += resolver.arguments[a].argumentName;
    }

    var auth = '';
    var headers = {};
    for(var p in resolver.apiRequests[0].parameters){
        var param = resolver.apiRequests[0].parameters[p];
        if(param.type == 'Authentication'){
            auth = param.parameterName + ':' + param.parameterValue;
        }else{
            headers[param.parameterName] = param.parameterValue;
        }
    }

    var body;
    if(resolver.apiRequests[0].body != "")
        body = resolver.apiRequests[0].body;
    else
        body = '\'\'';

    var resolverFunctionContext = {
        resolverName: resolver.resolverName,
        arguments: args,
        url: resolver.apiRequests[0].url,
        body: body,
        httpMethod: resolver.apiRequests[0].httpMethod,
        authentication: auth,
        headerParameters: JSON.stringify(headers)

    };

    console.log('resolverFunctionContext: ' + JSON.stringify(resolverFunctionContext));

    //render contexts into templates
    var resolverFunction = Mustache.render(resolverSingleReq, resolverFunctionContext);

    console.log('resolverFunction: \n' + resolverFunction);

    return resolverFunction;
};

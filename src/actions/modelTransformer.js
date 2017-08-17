import Mustache from 'mustache';
import resolverSingleReqTemplate from './mustache-templates/resolverSingleReq.mustache';
import resolverMultipleReqTemplate from './mustache-templates/resolverMultipleReq.mustache';
import apiRequestTemplate from './mustache-templates/apiRequest.mustache';

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
        if(resolver.apiRequests.length > 0) {
            if (resolver.apiRequests.length > 0 && resolver.apiRequests[0].httpMethod != "GET") {
                mutationString += '\n    ' + constructSchemaResolver(resolver);
            } else {
                queryString += '\n    ' + constructSchemaResolver(resolver);
            }
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

        var resolverFunction;
        if(resolver.apiRequests.length <= 1){
            resolverFunction = constructResolverFunctionSingleAPI(resolver);
        }else{
            resolverFunction = constructResolverFunctionMultiAPI(resolver)
        }

        if(resolver.apiRequests.length > 0 && resolver.apiRequests[0].httpMethod != "GET"){
            mutationsString += resolverFunction;
        }else{
            queriesString += resolverFunction;
        }

    }

    var resolversModel = {
        queries: queriesString,
        mutations: mutationsString
    };

    return resolversModel;
};

var constructResolverFunctionSingleAPI = function (resolver){

    var args = '';
    for(var a in resolver.arguments){
        if(a>0)
            args += ', ';
        args += resolver.arguments[a].argumentName;
    }

   var apiReq = '';
    if(resolver.apiRequests.length > 0)
        apiReq = constructAPIRequest(resolver.apiRequests[0], '');

    var resolverFunctionContext = {
        resolverName: resolver.resolverName,
        arguments: args,
        apiRequest: apiReq
    };

    //render context into template
    var resolverFunction = Mustache.render(resolverSingleReqTemplate, resolverFunctionContext);

    return resolverFunction;
};

var constructResolverFunctionMultiAPI = function (resolver){

    var args = '';
    for(var a in resolver.arguments){
        if(a>0)
            args += ', ';
        args += resolver.arguments[a].argumentName;
    }

    var apiRequestsString = '';
    var apiRequestVars = '';
    for(var r in resolver.apiRequests){
        var apiReqNo = (+r+1);
        apiRequestsString += constructAPIRequest(resolver.apiRequests[r], apiReqNo) + '\n';
        if(r != 0)
            apiRequestVars += ', ';
        apiRequestVars += 'apiReq' + apiReqNo;
    }

    var resolverFunctionContext = {
        resolverName: resolver.resolverName,
        arguments: args,
        apiRequests: apiRequestsString,
        apiRequestVars: apiRequestVars
    };

    //render context into template
    var resolverFunction = Mustache.render(resolverMultipleReqTemplate, resolverFunctionContext);

    return resolverFunction;
};

var constructAPIRequest = function (apiRequest, apiReqNo){

    //construct body
    var body;
    if(apiRequest.body != "")
        body = apiRequest.body;
    else
        body = '\'\'';

    //construct authentication
    var auth = '';
    if(apiRequest.authentication.username != '' && apiRequest.authentication.password != '')
        auth = apiRequest.authentication.username + '+\':\'+' + apiRequest.authentication.password;

    //construct header and query parameters
    var queryParam = '';
    var headers = '{';
    for(var p in apiRequest.parameters){
        var param = apiRequest.parameters[p];
        if(param.type == 'Query'){
            if(queryParam == '')
                queryParam += '+\'?';
            else
                queryParam += '+\'&';
            queryParam +=  param.parameterName + '=\'+' + param.parameterValue;
        }else{
            if(headers.length != 1)
                headers += ', ';
            headers += '\"' + param.parameterName + '\"' + ': ' + param.parameterValue;
        }
    }
    headers += '}';

    //construct URL
    var urlString = apiRequest.url;
    urlString = urlString.replace("{", "\'+");
    urlString = urlString.replace("}", "+\'");

    var apiRequestContext = {
        apiReqNo: apiReqNo,
        url: urlString,
        body: body,
        httpMethod: apiRequest.httpMethod,
        authentication: auth,
        headerParameters: headers,
        queryParameters: queryParam
    };

    //render context into template
    var apiReqCode = Mustache.render(apiRequestTemplate, apiRequestContext);

    return apiReqCode;
};

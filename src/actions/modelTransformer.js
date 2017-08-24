import Mustache from 'mustache';
import apiRequestTemplate from './mustache-templates/apiRequest.mustache';
import resolverFunctionTemplate from './mustache-templates/resolverFunction.mustache';

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

    var queryString = '# the schema allows the following query:\ntype Query { ';
    var mutationString = '# the schema allows the following mutations:\ntype Mutation { ';
    var queriesEmpty = true;
    var mutationsEmpty = true;

    //construct the resolver model for the schema
    var resolvers = serviceModel.resolvers;
    for(var r in resolvers){
        var resolver = resolvers[r];
        if (resolver.apiRequests.length > 0 && resolver.apiRequests[0].httpMethod != "GET") {
            mutationString += '\n    ' + constructSchemaResolver(resolver);
            mutationsEmpty = false;
        } else {
            queryString += '\n    ' + constructSchemaResolver(resolver);
            queriesEmpty = false;
        }
    }
    mutationString += '\n}';
    queryString += '\n}';

    //empty string if no mutations or no queries exists to avoid compilation errors in GraphQL
    if(queriesEmpty)
        queryString = '';
    if(mutationsEmpty)
        mutationString = '';

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
            //if arg is required add ! after the type
            if(arg.required){
                schemaResolver += '!'
            }
        }

        schemaResolver += ')';
    }
    schemaResolver += ': ' + resolverModel.returnType;

    return schemaResolver;
};

var transformToResolversModel = function (serviceModel){

    var resolvers = serviceModel.resolvers;

    var queriesString = '    Query: {\n';
    var mutationsString = '    Mutation: {\n';

    var queriesEmpty = true;
    var mutationsEmpty = true;

    //create functions for every resolver
    // and store them either in the queries- or mutations string
    for(var r in resolvers){
        var resolver = resolvers[r];

        var resolverFunction = constructResolverFunction(resolver);

        if(resolver.apiRequests.length > 0 && resolver.apiRequests[0].httpMethod != "GET"){
            mutationsString += resolverFunction;
            mutationsEmpty = false;
        }else{
            queriesString += resolverFunction;
            queriesEmpty = false;
        }

    }
    queriesString += '    },';
    mutationsString += '    }';

    //empty string if no mutations or no queries exists to avoid compilation errors in GraphQL
    if(queriesEmpty)
        queriesString = '';
    if(mutationsEmpty)
        mutationsString = '';

    var resolversModel = {
        queries: queriesString,
        mutations: mutationsString
    };

    return resolversModel;
};

var constructResolverFunction = function (resolver){
    var args = '';
    for(var a in resolver.arguments){
        if(a>0)
            args += ', ';
        args += resolver.arguments[a].argumentName;
    }

    var apiReq;
    var otherAPIRequests = '';
    if(resolver.apiRequests.length <= 1) {
        apiReq = constructAPIRequest(resolver.apiRequests[0], '');
    }else {
        apiReq = constructAPIRequest(resolver.apiRequests[0], 1);
        //remove first element from array because already in function then construct other api requests
        otherAPIRequests = constructOtherAPIRequests(resolver.apiRequests);
    }

    var resolverFunctionContext = {
        resolverName: resolver.resolverName,
        arguments: args,
        apiReqNo: apiReq.apiReqNo,
        url: apiReq.url,
        body: apiReq.body,
        httpMethod: apiReq.httpMethod,
        authentication: apiReq.authentication,
        headerParameters: apiReq.headerParameters,
        queryParameters: apiReq.queryParameters,
        otherAPIRequests: otherAPIRequests
    };

    //render context into template
    var resolverFunction = Mustache.render(resolverFunctionTemplate, resolverFunctionContext);

    return resolverFunction;
};

var constructOtherAPIRequests = function (requests){
    var apiRequestsString = '';
    for(var r in requests){
        if(r > 0) {
            var req = requests[r];
            var apiReqContext = constructAPIRequest(req, (+r + 1));
            apiRequestsString += Mustache.render(apiRequestTemplate, apiReqContext);
        }
    }

    //remove last \n of string for better format in resolvers.js
    apiRequestsString = apiRequestsString.slice(0, -1);

    return apiRequestsString;
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
    //to avoid syntax error in generated code add '' if no authentication
    else
        auth = '\'\'';

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
            queryParam +=  param.parameterName + '=\'+' + param.parameterValue.replace(/ /g,"+");
        }else{
            if(headers.length != 1)
                headers += ', ';
            headers += '\"' + param.parameterName + '\"' + ': ' + param.parameterValue;
        }
    }
    headers += '}';

    //construct URL
    var urlString = apiRequest.url;
    urlString = urlString.replace(/{/g, "\'+");
    urlString = urlString.replace(/}/g, "+\'");

    var apiRequestContext = {
        apiReqNo: apiReqNo,
        url: urlString,
        body: body,
        httpMethod: apiRequest.httpMethod,
        authentication: auth,
        headerParameters: headers,
        queryParameters: queryParam
    };

    return apiRequestContext;
};



exports.transformToServerModel = function (serviceModel) {
    var schema = buildSchema();
    var resolvers = buildResolvers();

    var serverModel = {
        port: serviceModel.serviceConfig.port,
        schema: schema,
        resolvers: resolvers
    };

    return serverModel;
};

exports.transformToPackageModel = function (serviceModel) {
    var packageModel = {
        appName: serviceModel.serviceConfig.appName,
        author: serviceModel.serviceConfig.author,
        description: serviceModel.serviceConfig.description
    };

    return packageModel;
};

var buildSchema = function (){
  return 'testSchemaBuild';
};

var buildResolvers = function (){
    return 'testResolverBuild';
};

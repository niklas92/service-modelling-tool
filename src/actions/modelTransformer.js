
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
    var schemaString = '\n';

    //construct the data model for the schema
    var entities = serviceModel.dataModel;
    for(var e in entities){
        var entity = entities[e];
        schemaString += 'type ' + entity.entityName + ' { \n';

        console.log("transform: " + JSON.stringify(entity));
        for(var p in entity.parameters){
            schemaString += '   ' + entity.parameters[p].parameterName + ': ' + entity.parameters[p].parameterType + '\n';
        }

        schemaString += '} \n';
    }

    var schemaModel = {
        schema: schemaString
    };

    return schemaModel;
};

var transformToResolversModel = function (serviceModel){

    var resolversModel = {
        resolvers: `{
            Query: {
                posts() {
                    return posts;
                },
                author(_, { id }) {
                    return find(authors, { id: id });
                },
                authors() {
                    return authors;
                },
            },
            Mutation: {
                upvotePost(_, { postId }) {
                    const post = find(posts, { id: postId });
                    if (!post) {
                        throw new Error("Couldn't find post");
                    }
                    post.votes += 1;
                    return post;
                },
                createPost(_, {authorId, title}) {
                    // Create an id for our "database".
                    var id = posts[posts.length - 1].id + 1;
                    var newPost = { id, authorId, title, votes: 0 };
                    posts.push(newPost);
                
                    return newPost;
                },
                deletePost(_, {postId}) {
                    var post = find(posts, {id: postId});
                    var index = posts.indexOf(post);
                    if (index > -1) {
                        posts.splice(index, 1);
                    } else {
                        throw new Error("Couldn't find post");
                    }
                
                    return post;
                }
            }
        };`
    };

    return resolversModel;
};

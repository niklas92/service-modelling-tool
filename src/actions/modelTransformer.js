
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

    var schemaModel = {
        schema: `
            type Author {
              id: Int! # the ! means that every author object _must_ have an id
              firstName: String
              lastName: String
              posts: [Post] # the list of Posts by this author
            }
            type Post {
              id: Int!
              title: String
              author: Author
              votes: Int
            }
            # the schema allows the following query:
            type Query {
              posts: [Post]
              author(id: Int!): Author
              authors: [Author]
            }
            # this schema allows the following mutation:
            type Mutation {
              upvotePost (postId: Int!): Post
              createPost (authorId: Int!, title: String!): Post
              deletePost (postId: Int!): Post
            }
            `
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

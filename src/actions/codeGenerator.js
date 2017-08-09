import Mustache from 'mustache';
import JSZip from 'jszip';
import FileSaver from 'file-saver';


exports.renderServerFile = function (gqlModel) {

    //Get mustache templates with jquery as promises
    var severTemplatePromise = $.get('/mustache-templates/server.mustache');
    var packageTemplatePromise = $.get('/mustache-templates/package.mustache');
    var schemaTemplatePromise = $.get('/mustache-templates/schema.mustache');
    var resolversTemplatePromise = $.get('/mustache-templates/resolvers.mustache');

    //Resolve both promises, then render mustache templates and export them
    Promise.all([severTemplatePromise, packageTemplatePromise, schemaTemplatePromise, resolversTemplatePromise])
    .then(function(templates){

        //render contexts into templates
        var serverOutput = Mustache.render(templates[0], gqlModel.serverModel);
        var packageOutput = Mustache.render(templates[1], gqlModel.packageModel);
        var schemaOutput = Mustache.render(templates[2], gqlModel.schemaModel);
        var resolversOutput = Mustache.render(templates[3], gqlModel.resolversModel);

        //create server as a zip folder
        var serverZip = new JSZip();
        serverZip.file('server.js', serverOutput);
        serverZip.file('package.json', packageOutput);

        var dataFolder = serverZip.folder('data');
        dataFolder.file('schema.js', schemaOutput);
        dataFolder.file('resolvers.js', resolversOutput);

        serverZip.generateAsync({type:'blob'})
            .then(function(content) {
                FileSaver.saveAs(content, 'query-service.zip');
                console.log('Server folder created and exported!');
            });
    });
};

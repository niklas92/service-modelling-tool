import Mustache from 'mustache';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import serverTemplate from './mustache-templates/server.mustache';
import packageTemplate from './mustache-templates/package.mustache';
import schemaTemplate from './mustache-templates/schema.mustache';
import resolversTemplate from './mustache-templates/resolvers.mustache';

exports.generateServer = function (gqlModel) {

    //render contexts into templates
    var serverOutput = Mustache.render(serverTemplate, gqlModel.serverModel);
    var packageOutput = Mustache.render(packageTemplate, gqlModel.packageModel);
    var schemaOutput = Mustache.render(schemaTemplate, gqlModel.schemaModel);
    var resolversOutput = Mustache.render(resolversTemplate, gqlModel.resolversModel);

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
};

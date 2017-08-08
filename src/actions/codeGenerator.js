import Mustache from 'mustache';
import JSZip from 'jszip';
import FileSaver from 'file-saver';


exports.renderServerFile = function (appName, portNr) {

    //Mustache Contexts
    var server_object = {
        port: portNr,
        schema: 'testSchema',
        resolvers: 'testResolver'
    };

    var package_object = {
        appName: appName
    };

    //Get mustache templates with jquery as promises
    var severTemplatePromise = $.get('/mustache-templates/server.mustache');
    var packageTemplatePromise = $.get('/mustache-templates/package.mustache');

    //Resolve both promises, then render mustache templates and export them
    Promise.all([severTemplatePromise, packageTemplatePromise]).then(function(templates){

        //render contexts into templates
        var serverOutput = Mustache.render(templates[0], server_object);
        var packageOutput = Mustache.render(templates[1], package_object);

        //create server as a zip folder
        var serverZip = new JSZip();
        serverZip.file("server.js", serverOutput);
        serverZip.file("package.json", packageOutput);
        serverZip.generateAsync({type:"blob"})
            .then(function(content) {
                FileSaver.saveAs(content, "query-service.zip");
                console.log('Server folder created and exported!');
            });
    });
};

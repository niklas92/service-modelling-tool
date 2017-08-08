import Mustache from 'mustache';
import JSZip from 'jszip';
import FileSaver from 'file-saver';


exports.renderServerFile = function (serverModel, packageModel) {

    //Get mustache templates with jquery as promises
    var severTemplatePromise = $.get('/mustache-templates/server.mustache');
    var packageTemplatePromise = $.get('/mustache-templates/package.mustache');

    //Resolve both promises, then render mustache templates and export them
    Promise.all([severTemplatePromise, packageTemplatePromise]).then(function(templates){

        //render contexts into templates
        var serverOutput = Mustache.render(templates[0], serverModel);
        var packageOutput = Mustache.render(templates[1], packageModel);

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

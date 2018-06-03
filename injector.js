//Inject video element
document.addEventListener('DOMContentLoaded', function () {
    // Remove existing scripts on the page
    var elementsToRemove = document.querySelectorAll('body>div.container, body>script, head>*');
    for(var i = 0; i < elementsToRemove.length; i++){
        elementsToRemove[i].parentNode.removeChild(elementsToRemove[i]);
    }

    var scriptsToInject = ['video.js', 'playlist.js'];

    //Inject the JS
    for(var i = 0; i < scriptsToInject.length; i++){
        var script = document.createElement('script');
        script.src = chrome.extension.getURL(scriptsToInject[i]);
        console.log('INJECT ' + scriptsToInject[i]);
        script.onload = function () {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(script);
    }

    //Inject the HTML
    //http://stackoverflow.com/questions/16334054/inject-html-into-a-page-from-a-content-script
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', chrome.extension.getURL('video.html'), false);
    xmlHttp.send(null);

    // Parse the HTML
    var domElements = parseHTML(xmlHttp.responseText);

    // Insert everything before the existing elements
    var firstBodyElement = document.body.firstChild;
    domElements.forEach(function(el) {
        document.body.insertBefore(el, firstBodyElement);
    });

    // Inject FontAwesome JS
    var script = document.createElement('script');
        script.src = chrome.extension.getURL('fontawesome-all.js');
        console.log('INJECT ' + 'fontawesome-all.js');
        (document.head || document.documentElement).appendChild(script);
    
    // Tell FontAwesome to nest SVGs
    var scriptConfig = document.createElement('script');
    scriptConfig.textContent = "FontAwesomeConfig = { autoReplaceSvg: 'nest' }";
    (document.head || document.documentElement).appendChild(scriptConfig);

    //Inject volume button images
    s = document.createElement('style');
    s.type = 'text/css'
    s.textContent =
        '#volume-button-icon.high{' +
        'background-image:url("' + chrome.extension.getURL('img/volume-high.png') + '");' +
        '}' +
        '#volume-button-icon.mid{' +
        'background-image:url("' + chrome.extension.getURL('img/volume-mid.png') + '");' +
        '}' +
        '#volume-button-icon.low{' +
        'background-image:url("' + chrome.extension.getURL('img/volume-low.png') + '");' +
        '}' +
        '#volume-button-icon.mute{' +
        'background-image:url("' + chrome.extension.getURL('img/volume-mute.png') + '");' +
        '}';
    (document.head || document.body).appendChild(s);
});

function parseHTML(htmlString) {
    return new DOMParser().parseFromString(htmlString, 'text/html').querySelectorAll('body > *');
}
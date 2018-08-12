'use strict';
var request = require('request');

let path = require('path');
var config = require(path.resolve('app/config/config.json'));

var inputText = document.getElementById('inputText')
var buttonTranslate = document.getElementById('buttonTranslate')
var languageSelection = document.getElementById('languageSelection')
var resultsDiv = document.getElementById('resultsDiv')

inputText.addEventListener('keypress', ()=>{
    if (event.keyCode === 13 && inputText.value && inputText.value.length > 1) {        
        sendQuery()
    }
})

buttonTranslate.addEventListener("click", () => {            
    sendQuery()
})

function sendQuery(text) {    
    var dictionary = languageSelection.options[languageSelection.selectedIndex].value
    var query = inputText.value
    
    request({url: config.PonsApiUrl,
             headers: {'X-Secret': config.XSecret}, 
             qs: {'l':dictionary, 'q':query}},             
             function (error, response, body) {
                // console.log('error:', error)
                // console.log('statusCode:', response && response.statusCode)
                if (response.statusCode == 200)
                    resultsDiv.innerHTML = transformToHTML(JSON.parse(body))
                else
                resultsDiv.innerHTML = 'nada..'
    })
}

function transformToHTML(json) {    
    var html = '<div>'
    for (var i = 0; i < json[0].hits.length; i++) {
        var romHtml = '<div>'        
        var rom = json[0].hits[i].roms[0]        
        romHtml +=  '<div class="headwordcurved">' + rom.headword + '</div>'
        
        romHtml +=  '<div style="text-indent:3em;">'        
        for (var j = 0; j < rom.arabs.length; j++) {
            var arab = rom.arabs[j]
            romHtml += '<div class="arabcurved">' + arab.header + '</div>'

            for (var k = 0; k < arab.translations.length; k++) {
                var translation = arab.translations[k]
                romHtml += '<div>' + translation.source  + '</div>'
                romHtml += '<div>' + translation.target  + '</div>'
                romHtml += '</br>'
            }
        }
        romHtml += '</div></div>'        
        html += romHtml
    }
    html += '</div>'
    return html
}
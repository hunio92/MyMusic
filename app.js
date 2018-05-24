var express = require('express');
var bodyParser = require('body-parser');
var swig = require('swig');
swig.setDefaults({ cache: false });
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require('fs');
var read = require('read');
var path = require('path');

var magyar_path = 'file://' + __dirname  + '/public/' + 'magyar.txt';

var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// set static patch
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    var list = readTextFile(magyar_path);
    res.render('index', {list: list});
});

app.post('/', function(req, res){
  if(req.body.inputPassword == "123qwe")
  {
    var delimiter = ' <|> ';
    var str = req.body.inputTitle + delimiter + req.body.inputLink;
    writeTextFile('magyar.txt', str);

    var list = readTextFile(magyar_path);
    list.push({ title: req.body.inputTitle, link: req.body.inputLink });

    res.render('index', {list: list});
  }
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on: localhost:${port}`));

// ************ FUNCTIONS ************ //

function readTextFile(file)
{
    var list = [];
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var lines = rawFile.responseText.split('\n');
                for(i = 0; i < lines.length; i++){
                    var res_split = lines[i].split("<|>");
                    list.push({ title: res_split[0], link: res_split[1] });
                }
            }
        }
    }
    rawFile.send(null);
    return list;
}

function writeTextFile(filename, output) {
    fs.open(filename, 'a+', (err, filename) => {
      if (err) throw err;
      fs.appendFile(filename, '\r\n' + output, 'utf8', (err) => {
        fs.close(filename, (err) => {
          if (err) throw err;
        });
        if (err) throw err;
      });
    });
}

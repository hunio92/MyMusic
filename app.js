var express = require('express');
var bodyParser = require('body-parser');
var swig = require('swig');
swig.setDefaults({ cache: false });
var fs = require('fs');
var read = require('read');
var path = require('path');

var file_path = __dirname  + '/public/' + 'magyar.txt'

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
    var list = readTextFile(file_path);
    res.render('index', {list: list});
});

app.post('/', function(req, res){
  if(req.body.inputPassword == "123qwe")
  {
    var delimiter = ' <|> ';
    var str = req.body.inputTitle + delimiter + req.body.inputLink;
    writeTextFile(file_path, str);

    var list = readTextFile(file_path);
    list.push({ title: req.body.inputTitle, link: req.body.inputLink });

    res.render('index', {list: list});
  }
});

const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log(`listening on: localhost:${port}`));

// ************ FUNCTIONS ************ //

function readTextFile(file_path)
{
    try {
      var data = fs.readFileSync(file_path, 'utf8')
      return data.split('\r\n').filter(line => line.length > 0).map((line) => {
        var comp = line.split("<|>")
        return { title: comp[0], link: comp[1] }
      });
    } catch (e) {
      return [];
    }
}

function writeTextFile(filename, output) {
    fs.open(filename, 'a+', (err, filename) => {
      if (err) throw err;
      fs.appendFile(filename, output + '\r\n', 'utf8', (err) => {
        fs.close(filename, (err) => {
          if (err) throw err;
        });
        if (err) throw err;
      });
    });
}

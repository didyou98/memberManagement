var fs = require('fs');
var ejs = require('ejs');
var express = require('express');
var bodyParser = require('body-parser');

// dummy Db
var DummyDB = (() => {
    var DummyDB = {};
    var storage = [];
    var count = 1;

    DummyDB.get = (id) => {
        if(id) {
            id = (typeof id == 'string') ? Number(id) : id;

            for(var i in storage)
            if (storage[i].id == id) {
                console.log(storage);
                return storage[i];
            }
            return '';
        } else {
            return storage;
        }
    };
    //Insert
    DummyDB.insert = (data) => {
        data.id = count++;
        storage.push(data);
        return data;
    };

    DummyDB.remove = (id) => {
        id = (typeof id == 'string') ? Number(id) : id;

        for(var i in storage) if (storage[i].id == id) {
            storage.splice(i, 1);

            return true;
        }
        return false;
    }
    return DummyDB;
})();

//서버 생성
var app = express();
app.use(bodyParser.urlencoded({extended : false}));


app.listen(8080, () => {console.log('Server Running at http://localhost:8080')});

//라우팅

app.get('./home', (req, res) => {
    fs.readFile('index.html', 'utf8', (err, data) => {
        res.send(data.toString());
    })
});

app.get('./list', (req, res) => {
    fs.readFile('LIST.ejs', 'utf8', (err, data) => {
        res.send(ejs.render(data.toString(), {
            Edata : DummyDB.get()
        }));
    })
});

app.get('/', (req, res) => {
    fs.readFile('index.html', 'utf8', (err, data) => {
        res.send(data.toString());
    })
});

//자료 입력

app.get('./insert', (req, res) => {
    fs.readFile('POST.ejs', 'utf8', (err, data) => {
        res.send(ejs.render(data.toString(), {
            Edata : DummyDB.get()
        }));
    })
});

app.post('./insert', (req, res) => {
    var name = req.body.name;
    var region = req.body.region;
    var birthday = req.body.birthday;
    if(name && region) {
        DummyDB.insert({name: name, region: region, birthday: birthday})
        var Edata = DummyDB.get();
        console.log(Edata);
    } else {
        throw new Error('error!');
    }
   res.redirect('./insert');
});

//자료 수정

app.get('./edit', (req, res) => {
    fs.readFile('./EDIT.ejs', 'utf8', (err, data) => {
        res.send(ejs.render(data.toString(), {
            Edata : DummyDB.get()
        }));
    })
});

app.post('./edit', (req, res) => {
    var Edata = DummyDB.get();
    var id = req.body.id;
    var name = req.body.name;
    var region = req.body.region;
    var birthday = req.body.birthday;
    Edata.forEach(element => {
        if(element.id == id) {
            element.birthday = birthday;
            element.name = name;
            element.region = region;
            console.log(element.id);
            res.redirect('./edit');
        }
    });
});

//자료 삭제

app.get('/del', (req, res) => {
    fs.readFile('DELETE.ejs', 'utf8', (err, data) => {
        res.send(ejs.render(data.toString(), {
            Edata : DummyDB.get()
        }));
    });
});

app.post('/del', (req, res) => {
    var Edata = DummyDB.get();
    var id = req.body.id;
    DummyDB.remove(id);
    console.log(Edata);
    res.redirect('/del');
});



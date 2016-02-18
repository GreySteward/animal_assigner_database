var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// bring in pg module
var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/animal_assigner';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// get data route
app.get('/people', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM people ORDER BY person_id ASC;');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // close connection
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});

app.get('/animal', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM animal ORDER BY animal_id ASC;');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // close connection
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});


app.post('/people', function(req, res) {
    var addPerson = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO people (first_name, last_name) VALUES ($1, $2) RETURNING person_id",
            [addPerson.first_name, addPerson.last_name],
            function (err, result) {
                done();
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });

});

app.post('/animal', function(req, res) {
    var addAnimal = {
  //      animal_id: req.body.animal_id,
        animal_name: req.body.animal_name,
        animal_color: req.body.animal_color
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO animal (animal_name, animal_color) VALUES ($1, $2) RETURNING animal_id",
            [addAnimal.animal_name, addAnimal.animal_color],
            function (err, result) {
                done();
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });

});

app.post('/addAnimalId', function(req, res) {
    var addAnimalId = {
        person_id: req.body.person_id,
        animal_id: req.body.animal_id
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query('UPDATE person_id SET animal_id = VALUES ($1)',
            [addAnimalId.animal_id],
            function (err, result) {
                done();
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });
});

app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});


app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});
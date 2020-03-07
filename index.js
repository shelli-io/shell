var Docker = require('dockerode');
const express = require('express')
const app = express()
const path = require('path');

var docker = new Docker({
    socketPath: '/var/run/docker.sock'
});

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ shells: [], count: 0 })
    .write()


// return all payments
app.get('/', function (req, res) {

    res.sendFile(path.join(__dirname+'/index.html'));

    
    // let shells = db.get('shells')
    //     .filter({ payed: false })
    //     .value()
    // res.send(shells)
})

app.post('/', function (request, response) {
    // create a shell
    docker.run('huhn/dockerized-web-app', [], process.stdout, {
        "HostConfig": {
            "PortBindings": {
                "8080/tcp": [
                    {
                        "HostPort": "8080"
                    }
                ]
            }
        }
    }, function (err, data, container) {
        if (err) {
            return console.error(err);
        }
        console.log(data.StatusCode);
        response.send({
            message: `Shell created. ${data.StatusCode}.`
        })
    });
})

// Start server
app.listen(3000, () => {
    console.log(`Server started on http://localhost:3000 `)
})
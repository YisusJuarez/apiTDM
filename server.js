var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
var server = app.listen(process.env.PORT || 8082, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

//Initiallising connection string
var dbConfig = {
    user: 'SA',
    password: 'CAPUFE',
    server: 'localhost',
    database: 'TDM'
};

//Function to connect to database and execute query
var executeQuery = function (res, query) {
    sql.connect(dbConfig, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            // create Request object
            var request = new sql.Request();
            // query to the database
            request.query(query, function (err, recordset) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    res.send(err);
                }
                else {
                    res.send(recordset);
                }
            });
        }
    });
}
//OBTENER ARTICULOS PARA INCIO
//GET API
app.get("/api/inicio", function (req, res) {
    var query = "SELECT TOP 9 Nombre, ImgUrl, Fecha FROM Articles ORDER BY IdArticle DESC";
    executeQuery(res, query);
});

//BUSCAR POR DIRECCION DEL ARTICULO PARA BLOGPOST
app.get("/api/articulo/:art", function (req, res) {
    //se obtiene ImgUrl al hacer post
    var ImgUrl = req.params.art;
     var query = `SELECT a.IdArticle, a.Url, a.Nombre, a.Fecha, a.Body, a.ImgUrl, u.UserName, s.Nombre AS Section FROM Articles a 
     INNER JOIN Users u ON a.IdUser = u.IdUser
     INNER JOIN Sections s ON a.IdSection = s.IdSection
     WHERE a.Url = '${ImgUrl}'`;
     console.log(query);
    executeQuery(res, query);
});
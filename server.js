var express = require("express");
var sql = require("mssql");
var app = express();
var json = require('json');

// Body Parser Middleware
app.use(express.json());

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
    database: 'TDM',
    parseJSON: true
};


app.get('/api/inicio', async function (req, res) {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(dbConfig)
    //const result = await sql.query`select * from mytable where id = ${value}`
    var result = await sql.query`SELECT TOP 9 Nombre, ImgUrl, FORMAT(Fecha,'yyyy-MM-dd HH:mm:ss') as Fecha FROM Articles ORDER BY IdArticle DESC`
    var inicio = JSON.parse(JSON.stringify(result))
    console.log(typeof inicio)
    res.json({ data: inicio });

});

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
app.get("/api/articulo/:art", function (req, res) {
    //se obtiene ImgUrl al hacer post
    var ImgUrl = req.params.art;
     var query = `SELECT TOP 1 a.IdArticle, a.Url, a.Nombre, FORMAT(Fecha,'yyyy-MM-dd HH:mm:ss') as Fecha, a.Body, a.ImgUrl, u.UserName, s.Nombre AS Section FROM Articles a 
     INNER JOIN Users u ON a.IdUser = u.IdUser
     INNER JOIN Sections s ON a.IdSection = s.IdSection
     WHERE a.Url = '${ImgUrl}'`;
     console.log(query);
    executeQuery(res, query);
});
app.get("/api/:img", function (req,res){
    var url = req.params.img;
    var imgsrc = `./public/${url}.jpg`;
    res.sendfile(imgsrc);
    console.log(imgsrc);
})
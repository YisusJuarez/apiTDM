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

// GET ART INICIO
app.get('/api/inicio', async function (req, res) {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(dbConfig)
    //const result = await sql.query`select * from mytable where id = ${value}`
    var result = await sql.query`SELECT TOP 9 Nombre, ImgUrl, FORMAT(Fecha,'yyyy-MM-dd HH:mm:ss') as Fecha FROM Articles ORDER BY cast([Fecha] as datetime) DESC`
    var inicio = JSON.parse(JSON.stringify(result))

    res.json({ data: inicio });

});
//GER ART INDV AND EXTRAS
app.get('/api/articulo/:art', async function (req, res) {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(dbConfig)
    var ImgUrl = req.params.art;
    //const result = await sql.query`select * from mytable where id = ${value}`
    var result = await sql.query`SELECT TOP 1 a.Id, a.Url, a.Nombre, FORMAT(Fecha,'yyyy-MM-dd HH:mm:ss') as Fecha, a.Body, a.ImgUrl, u.UserName, s.Nombre AS Section FROM Articles a 
    INNER JOIN Users u ON a.IdUser = u.IdUser
    INNER JOIN Sections s ON a.IdSection = s.IdSection
    WHERE a.Url = ${ImgUrl}`
    var result2 = await sql.query`select top 4 Url, Nombre, ImgUrl  from Articles WHERE Url != ${ImgUrl}`
    var inicio = JSON.parse(JSON.stringify(result.concat(result2)))
    res.json({ data: inicio });
    console.log(inicio)
});


// var executeQuery = function (res, query) {
//     sql.connect(dbConfig, function (err) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             // create Request object
//             var request = new sql.Request();
//             // query to the database
//             request.query(query, function (err, recordset) {
//                 if (err) {
//                     console.log("Error while querying database :- " + err);
//                     res.send(err);
//                 }
//                 else {
//                     res.send(recordset);
//                 }
//             });
//         }
//     });
// }
//GET IMG
app.get("/api/img/:img", function (req, res) {
    var url = req.params.img;
    var imgsrc = `./public/${url}.jpg`;
    res.sendfile(imgsrc);
})

// //Más artículos diferentes del actual para BlogPost
// app.get("/api/masarticulos/:ImgUrlactual", function(req, res){
//     var actual = req.params.ImgUrlactual;
//     var query = `SELECT TOP 4 Nombre, ImgUrl FROM Articles WHERE ImgUrl != '${actual}' ORDER BY IdArticle DESC`
//     executeQuery(res,query);
//     console.log(res, query);
// })

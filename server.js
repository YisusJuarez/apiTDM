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

//GET ALL ARTS W/ PAGINATION
app.get('/api/inicio/all', async function (req, res) {
    await sql.connect(dbConfig)
    var articles = await sql.query`SELECT Nombre, ImgUrl, FORMAT(Fecha,'yyyy-MM-dd HH:mm:ss') as Fecha FROM Articles ORDER BY cast([Fecha] as datetime) DESC OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY `;
    var result = JSON.parse(JSON.stringify(articles))
    res.json({ data: result });
    console.log(result)

});
//GET ALL ARTS W/ PAGINATION for more
app.get('/api/inicio/all/:next', async function (req, res) {
    await sql.connect(dbConfig)
    var next = parseInt(req.params.next);
    var articles = await sql.query`SELECT Nombre, ImgUrl, FORMAT(Fecha,'yyyy-MM-dd HH:mm:ss') as Fecha FROM Articles ORDER BY cast([Fecha] as datetime) DESC OFFSET 0 ROWS FETCH NEXT ${next} ROWS ONLY `;
    var result = JSON.parse(JSON.stringify(articles))
    res.json({ data: result });
    

});

//GET ARTS BY SECTION
app.get('/api/seccion/:section', async function (req, res) {
    await sql.connect(dbConfig)
    var seccion = req.params.section;
    var articles = await sql.query`SELECT Nombre, ImgUrl, FORMAT(Fecha,'yyyy-MM-dd HH:mm:ss') as Fecha FROM Articles WHERE IdSection = ${seccion} ORDER BY cast([Fecha] as datetime) DESC OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY`;
    var result = JSON.parse(JSON.stringify(articles))
    res.json({ data: result });

});
//GET MORE ARTS BY SECTION
app.get('/api/seccion/:section/:next', async function (req, res) {
    await sql.connect(dbConfig)
    var seccion = req.params.section;
    var next = parseInt(req.params.next);
    var articles = await sql.query`SELECT Nombre, ImgUrl, FORMAT(Fecha,'yyyy-MM-dd HH:mm:ss') as Fecha FROM Articles WHERE IdSection = ${seccion} ORDER BY cast([Fecha] as datetime) DESC OFFSET 0 ROWS FETCH NEXT ${next} ROWS ONLY`;
    var result = JSON.parse(JSON.stringify(articles))
    res.json({ data: result });
    console.log(next)

});



// GET ART INICIO
app.get('/api/inicio', async function (req, res) {
    await sql.connect(dbConfig)
    var articles = await sql.query`SELECT Nombre, ImgUrl, FORMAT(Fecha,'yyyy-MM-dd HH:mm:ss') as Fecha FROM Articles ORDER BY cast([Fecha] as datetime) DESC OFFSET 0 ROWS FETCH NEXT 9 ROWS ONLY `;
    var section = await sql.query`SELECT Nombre, IdSection from Sections`;
    var resultArray = [section]
    var result = JSON.parse(JSON.stringify(articles.concat(resultArray)))
    res.json({ data: result });
    console.log(result)

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
    var section = await sql.query`SELECT Nombre, IdSection from Sections`;
    var resultArray = [section]
    var inicio = JSON.parse(JSON.stringify(result.concat(result2,resultArray)))
    res.json({ data: inicio });

});

//GET IMG
app.get("/api/img/:img", function (req, res) {
    var url = req.params.img;
    var imgsrc = `./public/${url}.jpg`;
    res.sendfile(imgsrc);
})

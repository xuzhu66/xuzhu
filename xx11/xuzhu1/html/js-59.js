const { request, response } = require('express');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.get('/asd', (request, response) => {
//     response.send('hello express111');

// });
// app.get('/abc', (request, response) => {
//     response.send({ "name": "zs", "age": "12" });

// });
app.get('/tj', (request, response) => {
    response.send(request.query);

});
app.post('/post', (request, response) => {
    response.send(request.body);

});
app.post('/json', (request, response) => {
    response.send(request.body);

});
app.post('/aaa', (request, response) => {
    response.send(request.body);

});


// app.get('/api/ccc', (request, response) => {
//     let back = {
//         code: 200,
//         data: [{ a: 1 }],
//         msg: "cheng gong",
//         success: true
//     }
//     response.json(back)
// });

const cors = require('cors');
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
    res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
    next();
});



app.listen(8000, () => {
    console.log("服务器启动。。。");
})
const { request, response } = require('express');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/asd', (request, response) => {
    response.send('hello express111');

});
app.get('/abc', (request, response) => {
    response.send({ "name": "zs", "age": "12" });

});
app.listen(8000, () => {
    console.log("服务器启动。。。");
})
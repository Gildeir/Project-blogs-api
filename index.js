const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// const route = express.Router();
app.use(bodyParser.json())

const apiRoutes = express.Router();

app.use(apiRoutes);

const routes = require('./src/routes');

const PORT = process.env.PORT || 3000;


apiRoutes.get('/user', routes.getAllUsers);
apiRoutes.post('/user', routes.createUser);
apiRoutes.post('/login', routes.login);


app.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}!`));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

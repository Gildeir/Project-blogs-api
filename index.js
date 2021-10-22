const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const apiRoutes = express.Router();

app.use(express.json());

app.use(apiRoutes);

app.use(express.urlencoded({ extended: false }));

const routes = require('./src/routes');

const authMiddleware = require('./src/validateJWT');

const { validateEmail, checkDisplayName, checkPassword } = require('./src/routes');

app.listen(3000, () => console.log('Ouvindo na porta 3000!'));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

apiRoutes.get('/user', authMiddleware, routes.getAllUsers);
apiRoutes.get('/user/:id', authMiddleware, routes.getUserById);
apiRoutes.post('/user', validateEmail, checkDisplayName, checkPassword, routes.createUser);
apiRoutes.post('/login', routes.login);
apiRoutes.get('/categories', authMiddleware, routes.getAllCategories);
apiRoutes.post('/categories', authMiddleware, routes.createCategory);
apiRoutes.post('/post', authMiddleware, routes.createBlogPost);
apiRoutes.get('/post', authMiddleware, routes.getAllBlogPost);
apiRoutes.get('/post/:id', authMiddleware, routes.getPostById);
apiRoutes.put('/post/:id', authMiddleware, routes.editBlogPost);
apiRoutes.delete('/post/:id', authMiddleware, routes.deleteBlogPost);

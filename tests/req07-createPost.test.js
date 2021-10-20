const frisby = require('frisby');
const shell = require('shelljs');

const url = 'http://localhost:3000';

describe('7 - Sua aplicação deve ter o endpoint POST `/post`', () => {
  beforeEach(() => {
    shell.exec('npx sequelize-cli db:drop');
    shell.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $');
    shell.exec('npx sequelize-cli db:seed:all $');
  });

  it('Será validado que é possível cadastrar um blogpost com sucesso', async () => {
    let token;
    await frisby
      .post(`${url}/login`,
        {
          email: 'lewishamilton@gmail.com',
          password: '123456',
        })
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        token = result.token;
      });

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/post`, {
        title: 'Fórmula 1',
        content: 'O campeão do ano!',
        categoryIds: [1],
      })
      .expect('status', 201)
      .then((response) => {
        const { json } = response;
        expect(json.id).toBe(3);
        expect(json.title).toBe('Fórmula 1');
        expect(json.content).toBe('O campeão do ano!');
        expect(json.userId).toBe(1);
      });
  });

  it('Será validado que não é possível cadastrar um blogpost sem o campo `title`', async () => {
    let token;
    await frisby
      .post(`${url}/login`,
        {
          email: 'lewishamilton@gmail.com',
          password: '123456',
        })
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        token = result.token;
      });

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/post`, {
        content: 'O campeão do ano!',
        categoryIds: [1]
      })
      .expect('status', 400)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('"title" is required');
      });
  });

  it('Será validado que não é possível cadastrar um blogpost sem o campo `content`', async () => {
    let token;
    await frisby
      .post(`${url}/login`,
        {
          email: 'lewishamilton@gmail.com',
          password: '123456',
        })
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        token = result.token;
      });

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/post`, {
        title: 'O campeão do ano!',
        categoryIds: [1],
      })
      .expect('status', 400)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('"content" is required');
      });
  });

  it('Será validado que não é possível cadastrar um blogpost sem o campo `categoryIds`', async () => {
    let token;
    await frisby
      .post(`${url}/login`,
        {
          email: 'lewishamilton@gmail.com',
          password: '123456',
        })
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        token = result.token;
      });

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/post`, {
        content: 'O campeão do ano!',
        title: 'Fórmula 1'
      })
      .expect('status', 400)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('"categoryIds" is required');
      });
  });

  it('Será validado que não é possível cadastrar um blogpost com uma categoria inexistente', async () => {
    let token;
    await frisby
      .post(`${url}/login`,
        {
          email: 'lewishamilton@gmail.com',
          password: '123456',
        })
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        token = result.token;
      });

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/post`, {
        title: "Carros elétricos vão dominar o mundo?",
        content: "Já é possivel encontrar diversos carros elétricos em todo o mundo, será esse nosso futuro?",
        categoryIds: [3],
      })
      .expect('status', 400)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('"categoryIds" not found');
      });
  });

  it('Será validado que não é possível cadastrar um blogpost sem o token', async () => {
    await frisby
      .setup({
        request: {
          headers: {
            Authorization: '',
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/post`, {
        title: 'Fórmula 1',
        content: 'O campeão do ano!',
        categoryIds: [1],
      })
      .expect('status', 401)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('Token not found');
      });
  });

  it('Será validado que não é possível cadastrar um blogpost com o token inválido', async () => {
    await frisby
      .setup({
        request: {
          headers: {
            Authorization: 'kwngu4425h2',
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/post`, {
        title: 'Fórmula 1',
        content: 'O campeão do ano!',
        categoryIds: [1],

      })
      .expect('status', 401)
      .then((response) => {
        const { json } = response;
        expect(json.message).toBe('Expired or invalid token');
      });
  });
});

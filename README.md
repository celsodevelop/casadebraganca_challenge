

<div align="center">
<h1>DESAFIO CASA DE BRAGANÇA</h1>
<br/><br/>
Proposto por: <a href="http://www.casadebraganca.com/">Casa de Bragança Martech</a><br/><br/>

<div align="left">
  <h2><strong>Stack principal:</strong></h2>
</div>

![Typescript][typescript-shield]
![Docker][docker-shield]
![NodeJS][node-shield]
![ExpressJS][express-shield]
![Eslint][eslint-shield]

</div>

---

## Sobre o Projeto
<br/>


  O projeto a seguir, apresenta-se como uma solução de um sistema para:
  - cadastrar e administrar cartões de visitas com fotos na nuvem;
  - cadastrar cartões de visita em lote via CSV.

      A arquitetura foi pensada tendo em vista o padrão `Model-Service-Controller` (MVC). Optou-se pela utilização do banco de dados `postgres` acoplado a ferramenta de ORM: `TypeORM`. Há tratamento central de erros em middleware próprio com classes personalizadas de erros para uso ao longo do fluxo de execução. Utilizou-se o upload do arquivo de foto em nuvem `Cloudinary` e armazenamento da url no banco de dados. Cuidados de segurança foram implementados como: contra ataques de injection nos inputs de dados; Os nomes dos arquivos e ids seguem um padrao uuid.v4 evitando a colisão de nomes e o abuso de nomes sequenciais; O servidor em produção pode utilizar o `nginx` como proxy reverso para permitir a comunicação via `https`.

---

## Instalação

### Ambiente desenvolvimento Docker
<br/>

  - Crie os volumes `*cdb-node`(armazena node_modules) e `*cdb-data`(persistencia do banco local) com `docker volume create --name=${*nomes dos volumes}`
  - Renomeie e altere os valores das variáveis de ambiente do `Cloudinary` no arquivo `.env.sample`
  - Você pode rodar o comando `docker-compose up` na raiz. Na primeira execução, o comando vai fazer o build da imagem o que pode levar alguns minutos, após utilize apenas esse comando para rodar seu ambiente de desenvolvimento nas próximas execuções;
  - Na primeira execução, entre no bash do docker executando em outra sessão de terminal o comando `docker exec -it cdb-node bash` e então execute as migrations para criar a estrutura do banco com `npm run typeorm -- migrations:run`.
  - A API em modo desenvolvimento está pronta para uso via `localhost:5000`.

<br/>

---

## Uso do sistema
<br/>

 Abaixo um exemplo do modelo do contrato encontrado nas rotas disponíveis:

- Rota `Card.routes.ts`

    PUT /cards

  - Salvar novo cartão


- Request
     ```javascript
    {
      "name": "testName",
      "email": "test@test.com",
      "company": "testCompany",
      "jobTitle": "testJobTitle",
      "phoneNumber": "+55123456789",
    }
    ```
- Response
    ```javascript
    {
      "company": "testCompany",
      "email": "test2@test.com",
      "id": "57fdfc8e-cb9d-4011-a3c2-0052124f86af",
      "job_title": "testJob",
      "name": "test",
      "phone_number": "+55test123",
      "photo": null
    }
    ```

Nas rotas onde há a necessidade de upload de arquivos utilize como o nome do campo `multpart-formdata` para o arquivo da seguinte forma:

  - `card-image` para imagem
  - `csv-file` para o arquivo CSV

---


## O que faltou?

Seria interessante a criação de testes ao longo do processo de desenvolvimento. Deveria-se fazer no mínimo um teste de integração. O teste cobrindo os casos mais críticos de uso ajudariam no desenvolvimento mais fluido de novas features.

---


## License

      UNLICENSED yet.

---

## Authors

  > Celso Oliva - [celsodevelop][github-url]

---

## Acknowledgements

* [Typescript](https://www.typescriptlang.org)

---

<div align="center">
CasaDeBraganca Challenge - 2022 &copy;
</div>

<!-- MARKDOWN LINKS -->
[npm-shield]: https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white
[typescript-shield]: https://img.shields.io/static/v1?logo=TYPESCRIPT&message=TypeScript&style=for-the-badge&color=3178C6&logoColor=fff&labelColor=gray&label=
[docker-shield]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[node-shield]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white

[eslint-shield]: https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white
[express-shield]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB

[type-url]: https://www.typescriptlang.org
[node-url]: https://nodejs.org/
[github-url]: https://github.com/celsodevelop

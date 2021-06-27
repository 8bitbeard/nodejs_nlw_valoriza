# NLW Valoriza

## Introdução

- Este projeto foi desenvolvido na semana da Next Level Week #06. Se trata de uma API para criação de Elogios a usuários de uma determinada empresa. Com ela, é possível:
  - Realizar login com usuários cadastrados
  - Adicionar usuários
  - Editar dados dos usuários
  - Editar senha dos usuários
  - Excluir usuários
  - Cadastrar `TAGS` para armazenar comentários de elogio
  - Remover tags
  - Cadastrar elogios para usuários, que devem ser linkados a uma tag
  - Remover elogios

## Tecnologias usadas:
- NodeJS
- Typescript
- Express
- Typeorm

## Documentação da API:

É possível consultar a documentação da API no swagger hospedado no github, através do github-pages
Link: https://8bitbeard.github.io/nlw-together/nlwValoriza/#/

## Regras de Negócio

- Cadastro de usuário
  - :heavy_check_mark: Não é permitido cadastrar mais de um usuário com o mesmo e-mail
  - :heavy_check_mark: Não é permitido cadastrar usuário sem e-mail

- Cadastro de TAG
  - :heavy_check_mark: Não é permitido cadastrar mais de uma tag com o mesmo nome
  - :heavy_check_mark: Não é permitido cadastrar TAG sem nome
  - :heavy_check_mark: Não é permitido o cadastro por usuários que não sejam administradores

- Cadastro de elogios
  - :heavy_check_mark: Não é permitido um usuário cadastrar um elogio para sí
  - :heavy_check_mark: Não é permitido cadastrar elogios para usuários inválidos
  - :heavy_check_mark: O usuário precisa estar autenticado na aplicação

- Alteração de senha
  - :heavy_check_mark: Não é permitido alterar a senha sem estar autenticado
  - :heavy_check_mark: O usuário só poderá alterar a própria senha
  - A senha cadastrada deve ser composta por somente 4 números

- Alteração dos dados de um usuário
  - :heavy_check_mark: Somente um usuário administrador pode realizar a alteração dos dados de um usuário

- Exclusão de usuários
  - :heavy_check_mark: Somente um usuário administrador pode realizar a exclusão de outro usuário
  - :heavy_check_mark: Um usuário não pode se auto excluir


## Diagrama de Tabelas do Banco de Dados:

![Diagrama de Tabelas](./images/table_diagram.png)

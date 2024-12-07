# Sistema de Gerenciamento do Grupo World Beauty

Objetivo: junção back e frontend

Este sistema oferece diversas funcionalidades para gerenciar clientes, produtos, serviços e compras.


### Estrutura do Menu e Submenus

```java
Menu Principal
  ├── Gerenciar Clientes
  │     ├── Cadastrar Cliente
  │     ├── Listagem Clientes
  │     │── Top 10 Clientes que Mais Consumiram
  │     ├── Top 10 Clientes que Menos Consumiram
  │     ├── Top 5 Clientes por Valor Consumido
  │     ├── Listar por Gênero
  ├── Gerenciar Produtos
  │     ├── Cadastrar Produto
  │     ├── Listagem Produtos
  ├── Gerenciar Serviços
  │     ├── Cadastrar Serviço
  │     ├── Listagem Serviços
  └── Gerenciar Compras
        ├── Cadastrar Compra
        ├── Listar Compras
        ├── Produtos Mais Consumidos
        ├── Serviços Mais Consumidos
        ├── Produtos Mais Consumidos por Gênero
        ├── Serviços Mais Consumidos por Gênero
```

### Instruções de Uso

1. Ao iniciar o sistema, escolha a opção desejada no menu principal.
2. Navegue pelos submenus para realizar ações específicas.
3. As listagens oferecem relatórios organizados para tomada de decisão.
4. Utilize as opções de edição e exclusão com cuidado, pois impactam os registros existentes.

Primeiro passa e dar o seguinte comando onde estiver o arquivo package.json

```bash
# backend
./npm install
```

```bash
# frontend
./npm install
```


Para a execução do sistema, deve-se digitar no terminal:

1 Passo: criar um banco de dados no MYSQL chamado atvv

Observação importante: quando o sistema no backend inicializa, é feita a carga de arquivos .json que se encontram na pasta data. Dessa forma populamos o banco de dados. Isso se dá através de funções que foram criadas no arquivo ./src/config/server.ts. São essas as funções:

- importarClientes();
- importarServicos();
- importarCompras();
- importarProdutos();

```bash
# backend
./npm run dev
```

Esse processo de dá de forma automatizada quando inicia-se o backend.

```bash
# frontend
./npm start
```
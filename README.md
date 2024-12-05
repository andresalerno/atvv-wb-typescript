# Sistema de Gerenciamento do Grupo World Beauty

Objetivo: incluir o desenvolvimento com hooks e componentes de função.

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
./npm install
```


Para a execução do sistema, deve-se digitar no terminal:

```bash
./npm start
```
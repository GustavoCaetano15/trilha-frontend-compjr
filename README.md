#  CineComp - Gestão de Catálogo de Filmes (2026.2)

Aplicação Web desenvolvida para o Desafio de Front-End do CineComp. O sistema consiste em uma plataforma interativa para gestão de filmes, contando com autenticação via token JWT, rotas protegidas e funcionalidades completas de CRUD (Create, Read, Update, Delete) integradas com API REST.

---

##  Tecnologias e Bibliotecas Utilizadas

* **React (Vite):** Escolhido por proporcionar renderização rápida via Virtual DOM, ecossistema moderno e excelente desempenho durante o desenvolvimento.
* **JavaScript (ES6+):** Linguagem base para manipulação dinâmica do estado da aplicação.
* **Axios:** Utilizado para consumo de dados da API REST e manipulação automatizada dos cabeçalhos de autorização com Token Bearer (JWT).
* **CSS-in-JS / Inline Dynamic Styles:** Escolhido para styling direto dos componentes, garantindo isolamento de estilos sem dependências externas adicionais e mantendo a interface leve e responsiva.

---

## Estrutura do Projeto

A arquitetura do projeto segue a separação modular recomendada:

```text
src/
├── assets/        # Recursos estáticos (imagens, ícones, etc.)
├── components/    # Componentes React reutilizáveis (Header, Modais, etc.)
├── pages/         # Telas da aplicação (Login, Movies/Dashboard)
├── services/      # Configuração do Axios e rotas do back-end
└── styles/        # Arquivos de estilo global e formatações CSS

EXECUÇÃO DO PROJETO

Pré-requisitos

    Node.js (versão 18 ou superior)

    Gerenciador de pacotes npm

Passo a passo

-Clonar o repositório
git clone [https://github.com/GustavoCaetano15/trilha-frontend-compjr.git](https://github.com/GustavoCaetano15/trilha-frontend-compjr.git)
cd trilha-frontend-compjr

-Instalar as dependências
npm install

-Executar a aplicação
npm run dev

-Acessar o navegador
Abra http://localhost:5173

Autenticação e Funcionalidades

    Autenticação JWT: Login com e-mail e senha guardando o token no localStorage (@CineComp:token).

    Rotas Protegidas: Acesso ao catálogo restrito a usuários logados.

    CRUD Completo: Criação, listagem, edição e exclusão de filmes integrados com a API.

    Sincronização de Estado Local: Manipulação do estado do React (setMovies) para refletir inserções e exclusões instantaneamente na interface de forma fluida.

    UX & Responsividade: Interface escura estilo catálogo com feedbacks de carregamento (Salvando..., Excluindo...) e notificações de sucesso.
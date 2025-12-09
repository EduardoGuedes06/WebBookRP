Aqui está o conteúdo completo e formatado em **Markdown**.

Você deve copiar o código abaixo (clicando no botão "Copiar" no canto superior direito do bloco) e salvar em um arquivo chamado **`README.md`** na raiz do seu projeto.

````markdown
# 📚 WebBookRP - Plataforma do Autor

![NodeJS](https://img.shields.io/badge/Node.js-20.x-green?style=flat&logo=node.js) ![PM2](https://img.shields.io/badge/PM2-Runtime-blue?style=flat&logo=pm2) ![Server](https://img.shields.io/badge/Server-Ubuntu-orange?style=flat&logo=ubuntu) ![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)

Bem-vindo à documentação oficial do **WebBookRP**. Este guia serve como a "bíblia" do projeto, cobrindo desde a configuração do ambiente Windows local até o deploy em produção no Ubuntu com proxy reverso.

---

## 📑 Índice Interativo

1. [🏠 Ambiente Local & Estrutura](#1-ambiente-local--estrutura)
2. [⚙️ Configuração do Git & Versionamento](#2-configuração-do-git--versionamento)
3. [🔄 Fluxo de Desenvolvimento (Branches)](#3-fluxo-de-desenvolvimento-workflow)
4. [☁️ Preparando o Servidor (Ubuntu)](#4-preparando-o-servidor-ubuntu)
5. [🔑 Autenticação SSH (GitHub)](#5-autenticação-ssh-github--servidor)
6. [🚀 Deploy & PM2](#6-deploy--execução-com-pm2)
7. [🌐 Proxy Reverso (Nginx)](#7-proxy-reverso-nginx-opcional)
8. [🔄 Atualização Contínua](#8-atualização-do-projeto-deploy-rápido)
9. [✨ Boas Práticas](#9-dicas-e-boas-práticas)

---

## 1. 🏠 Ambiente Local & Estrutura

Antes de codar, garanta que seu ambiente Windows tenha a estrutura correta.

### 📂 Árvore de Arquivos
```text
/WebBookRP
│
├── node_modules/       # 🚫 Ignorado pelo Git (dependências)
├── public/             # 🎨 Frontend (HTML, CSS, JS do cliente)
│   ├── index.html
│   └── css/
├── src/                # 🧠 Lógica do Backend (se houver separação)
├── .env                # 🔒 Variáveis de ambiente (Ignorado)
├── .gitignore          # 📄 Arquivo de exclusão do Git
├── package.json        # 📦 Manifest do projeto
├── package-lock.json   # 📌 Versões exatas das dependências
└── server.js           # 🚀 Ponto de entrada (Servidor Express)
````

### 📄 .gitignore (Essencial)

Crie um arquivo `.gitignore` na raiz para não sujar o repositório:

```text
node_modules/
dist/
.env
*.log
.DS_Store
coverage/
```

-----

## 2\. ⚙️ Configuração do Git & Versionamento

Se é a primeira vez rodando o projeto, inicialize o repositório:

```bash
# 1. Iniciar o Git
git init

# 2. Adicionar o repositório remoto
git remote add origin [https://github.com/EduardoGuedes06/WebBookRP.git](https://github.com/EduardoGuedes06/WebBookRP.git)

# 3. Primeiro Commit
git add .
git commit -m "🎉 Initial commit: Estrutura do WebBookRP"

# 4. Enviar para a main e definir upstream
git push -u origin main
```

-----

## 3\. 🔄 Fluxo de Desenvolvimento (Workflow)

Para manter a organização, usamos um **padrão de Timestamp** para branches. Nunca trabalhe direto na `main`.

### 📅 Padrão de Branch: `feature/nome-DDMMYYHHMM`

1.  **Criar a Branch (Ex: login, dia 09/12/25 às 14:30):**

    ```bash
    git checkout -b feature/login-0912251430
    ```

2.  **Desenvolver e Testar:**
    Faça suas alterações no código e teste localmente (`node server.js`).

3.  **Salvar Alterações:**

    ```bash
    git add .
    git commit -m "feat: adiciona sistema de login básico"
    ```

4.  **Enviar para GitHub:**

    ```bash
    git push origin feature/login-0912251430
    ```

5.  **Merge para Main (Após validar):**

    ```bash
    git checkout main
    git pull origin main             # Garante que a main local está atualizada
    git merge feature/login-0912251430
    git push origin main             # Atualiza a main no GitHub
    ```

-----

## 4\. ☁️ Preparando o Servidor (Ubuntu)

Acesse seu servidor via terminal (`ssh usuario@ip-do-servidor`) e prepare o terreno.

### 🛠️ Instalação das Ferramentas

```bash
# 1. Atualizar o sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Git e Curl
sudo apt install git curl -y

# 3. Instalar Node.js (Versão 20 LTS)
curl -fsSL [https://deb.nodesource.com/setup_20.x](https://deb.nodesource.com/setup_20.x) | sudo -E bash -
sudo apt install -y nodejs

# 4. Instalar Gerenciador de Processos (PM2)
sudo npm install -g pm2

# 5. Criar pasta de organização
mkdir -p ~/apps
```

-----

## 5\. 🔑 Autenticação SSH (GitHub & Servidor)

Para que o servidor consiga clonar repositórios privados ou fazer pulls sem pedir senha toda hora:

1.  **No Servidor Ubuntu**, gere a chave:

    ```bash
    ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
    # Dê Enter para todas as perguntas (padrão)
    ```

2.  **Ler a chave pública:**

    ```bash
    cat ~/.ssh/id_ed25519.pub
    ```

    *Copie o código que começa com `ssh-ed25519...`*

3.  **No GitHub:**

      - Vá em *Settings* \> *SSH and GPG keys* \> *New SSH key*.
      - Cole o conteúdo que você copiou.

-----

## 6\. 🚀 Deploy & Execução com PM2

Agora vamos colocar o site no ar.

1.  **Clonar o Repositório (usando SSH):**

    ```bash
    cd ~/apps
    # Use a URL SSH agora, não HTTPS
    git clone git@github.com:EduardoGuedes06/WebBookRP.git
    cd WebBookRP
    ```

2.  **Instalar Dependências:**

    ```bash
    npm install --production
    ```

3.  **Iniciar com PM2 (O Segredo do 24/7):**

    ```bash
    # Inicia o app com o nome "webbookrp"
    pm2 start server.js --name webbookrp

    # Congela a lista de processos para reiniciar se o servidor cair
    pm2 save

    # Gera o script de inicialização (copie o comando que o terminal der e rode)
    pm2 startup
    ```

-----

## 7\. 🌐 Proxy Reverso Nginx (Opcional)

Para acessar via `http://seudominio.com` (Porta 80) em vez de `http://ip:3000`.

1.  **Instalar e Configurar:**

    ```bash
    sudo apt install nginx -y
    sudo nano /etc/nginx/sites-available/webbookrp
    ```

2.  **Cole a Configuração:**
    *(Altere `server_name` para seu IP ou Domínio)*

    ```nginx
    server {
        listen 80;
        server_name SEU_DOMINIO_OU_IP;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **Ativar:**

    ```bash
    sudo ln -s /etc/nginx/sites-available/webbookrp /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

-----

## 8\. 🔄 Atualização do Projeto (Deploy Rápido)

Sempre que você der push na `main`, rode isso no servidor:

```bash
# 1. Atualizar Código
cd ~/apps/WebBookRP
git pull origin main

# 2. Atualizar Dependências (se necessário)
npm install

# 3. Reiniciar Aplicação (Sem downtime perceptível)
pm2 restart webbookrp
```

-----

## 9\. ✨ Dicas e Boas Práticas

| Prática | Descrição |
| :--- | :--- |
| **Commits Atômicos** | Faça commits pequenos focados em uma única tarefa. Evite "comitar tudo" de uma vez. |
| **Use .env** | Nunca suba senhas ou chaves de API para o GitHub. Use o arquivo `.env` e carregue com `dotenv`. |
| **Logs do PM2** | Deu erro? Use `pm2 logs webbookrp` para ver o que aconteceu em tempo real. |
| **Monitoramento** | Use `pm2 monit` para ver uso de CPU e Memória do seu servidor. |

-----

## 10\. 🛠️ Deploy Automático com `deploy.sh`

Para facilitar a atualização do projeto no servidor, criamos um **script Bash** que:

1. Para o container antigo (se existir)
2. Remove o container antigo
3. Builda a nova imagem Docker
4. Roda o container atualizado

### 📄 Conteúdo do `deploy.sh`

```bash
#!/bin/bash

# Nome do container e da imagem
CONTAINER_NAME="webbookrp"
IMAGE_NAME="webbookrp"

# Caminho do projeto
PROJECT_DIR="$HOME/apps/WebBookRP"

echo "Deploy iniciado..."

# 1. Ir para a pasta do projeto
cd $PROJECT_DIR || exit

# 2. Puxar alterações do Git
echo "Atualizando repositório..."
git pull origin main

# 3. Build da nova imagem Docker
echo "Construindo nova imagem Docker..."
docker build -t $IMAGE_NAME .

# 4. Parar e remover container antigo (se existir)
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Parando container antigo..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# 5. Rodar o novo container
echo "Rodando novo container..."
docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_NAME

echo "Deploy concluído com sucesso!"
```

### ⚡ Como usar

1. Conceda permissão de execução ao script:

```bash
chmod +x deploy.sh
```

2. Execute sempre que quiser atualizar o servidor:

```bash
./deploy.sh
```

> Isso garante que o container sempre será atualizado com as últimas alterações do Git, sem precisar rodar cada comando manualmente.


*Desenvolvido por Eduardo Guedes* 🚀

```
```
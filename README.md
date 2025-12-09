# WebBookRP - Guia de Desenvolvimento e Deploy Node.js

Este guia descreve passo a passo como desenvolver, versionar e fazer deploy do projeto Node.js **WebBookRP** usando Git e PM2, do ambiente local (Windows) para o servidor Ubuntu.

---

## 1️⃣ Estrutura do Projeto (Windows)

```
/WebBookRP
  |-- node_modules/       # Ignorado no Git
  |-- src/                # Código-fonte
  |-- package.json
  |-- package-lock.json
  |-- .gitignore          # node_modules, logs, .env
```

**.gitignore sugerido:**
```
node_modules/
*.log
.env
```

---

## 2️⃣ Inicializando o Git

```bash
git init
git remote add origin https://github.com/EduardoGuedes06/WebBookRP.git
git add .
git commit -m "Commit inicial do projeto"
git push -u origin main
```

---

## 3️⃣ Fluxo de Desenvolvimento Local

1. **Criar branches para novas features:**
```bash
git checkout -b feature/nome-da-feature
```
2. **Desenvolver e testar localmente**
3. **Commit e push da branch:**
```bash
git add .
git commit -m "Implementa nova feature"
git push origin feature/nome-da-feature
```
4. **Merge para main:**
```bash
git checkout main
git pull origin main
git merge feature/nome-da-feature
git push origin main
```

> Sempre mantenha a `main` estável.

---

## 4️⃣ Configuração do Servidor (Ubuntu)

1. **Atualizar pacotes e instalar Git:**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git -y
```
2. **Instalar Node e NPM** (caso não esteja):
```bash
node -v
npm -v
```
3. **Instalar PM2:**
```bash
sudo env "PATH=$PATH" npm install -g pm2
```
4. **Criar pasta para projetos:**
```bash
mkdir -p ~/apps
cd ~/apps
```

---

## 5️⃣ Clonar Projeto no Servidor

```bash
cd ~/apps
git clone https://github.com/EduardoGuedes06/WebBookRP.git
cd WebBookRP
npm install
```

> `node_modules` não é versionado; o servidor instala via `npm install`.

---

## 6️⃣ Rodar o Projeto com PM2

```bash
pm2 start server.js --name webbookrp   # substitua server.js pelo arquivo principal
pm2 save
pm2 startup
```

- O app agora roda em background e reinicia automaticamente após reboot.

---

## 7️⃣ Atualizando o Projeto no Servidor

Quando houver alterações no GitHub:

```bash
cd ~/apps/WebBookRP
git pull origin main
npm install          # só se houver novas dependências
pm2 restart webbookrp
```

> Isso mantém o servidor sempre com a versão mais recente.

---

## 8️⃣ (Opcional) Configurar Nginx como Proxy Reverso

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/webbookrp
```

**Exemplo de configuração:**
```
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

```bash
sudo ln -s /etc/nginx/sites-available/webbookrp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

> Agora você pode acessar seu app pelo domínio ou IP sem precisar da porta 3000.

---

**Este fluxo garante:**
- Desenvolvimento seguro no Windows
- Versionamento correto com Git
- Deploy confiável no servidor Ubuntu
- Processo contínuo com PM2 para manter o Node rodando
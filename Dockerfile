# Estágio 1: Build
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copia o package.json e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o resto do código
COPY . .

# Estágio 2: Produção
FROM node:18-alpine
WORKDIR /usr/src/app

# Copia as dependências instaladas do estágio anterior
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copia o código da aplicação
COPY . .

# Expõe a porta que a aplicação vai usar
EXPOSE 8242

# Comando para iniciar a aplicação
CMD [ "node", "server.js" ]
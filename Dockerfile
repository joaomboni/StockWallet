FROM public.ecr.aws/docker/library/node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código fonte
COPY . .

# Expõe a porta que a aplicação usa
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]


FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install npm dependencies
RUN npm install

# Copy all source files
COPY . .

EXPOSE 8080

ENV VITE_API_URL=http://enginelab.ufc.br/back/api

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]

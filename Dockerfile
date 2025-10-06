# 1. Base image
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# 2. Install dependencies
RUN npm install

# 3. Copy project files
COPY . .

# 4. Build app
RUN npm run build

# 5. Start app
EXPOSE 3000
CMD ["npm", "run", "start"]
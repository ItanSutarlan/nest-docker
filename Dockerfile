# Stage 1: Build the application
FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create a lightweight image
FROM node:20-alpine

WORKDIR /app
ENV PORT=3000
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install

# Copy only necessary files from the build stage
COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}

CMD ["node", "dist/main.js"]

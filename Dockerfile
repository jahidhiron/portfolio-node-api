FROM node:20-alpine3.18

WORKDIR /app
COPY ./package.json ./

# Install PM2 globally
RUN npm install pm2 -g

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi
        
COPY ./ ./
EXPOSE $PORT

CMD ["pm2-runtime", "./dist/server.js"]
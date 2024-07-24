# build stage
FROM node:18 as build-stage

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/

RUN pnpm install

COPY . .

RUN pnpm run build

# production stage
FROM nginx:stable as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# build stage
FROM node:20.16.0-alpine3.19 AS build-stage

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm config set registry https://registry.npmmirror.com/ && npm cache clean --force

RUN npm install -g pnpm && pnpm --version

RUN pnpm config set registry https://registry.npmmirror.com/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# production stage
FROM nginx:1.27-alpine AS production-stage

# 复制构建产物到 Nginx HTML 目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置文件
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 5001

CMD ["nginx", "-g", "daemon off;"]

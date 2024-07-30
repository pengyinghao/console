# build stage
FROM node:18.0-alpine3.14 AS build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml 文件到工作目录
COPY package.json pnpm-lock.yaml ./

# 设置 npm registry 并清理缓存
RUN npm config set registry https://registry.npmmirror.com/ && npm cache clean --force

# 安装 pnpm 并验证安装
RUN npm install -g pnpm && pnpm --version

# 设置 pnpm registry
RUN pnpm config set registry https://registry.npmmirror.com/

# 安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 复制所有文件到工作目录
COPY . .

# 运行构建命令
RUN pnpm run build

# production stage
FROM nginx:stable AS production-stage

# 复制构建产物到 Nginx HTML 目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置文件
COPY docker/nginx.conf /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]

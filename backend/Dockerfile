# Sử dụng Node.js LTS
FROM node:20

# Set thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json trước để cache dependency
COPY package.json yarn.lock ./

# Cài đặt NestJS và dependencies
RUN yarn install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 3000 cho backend
EXPOSE 3000

# Chạy ứng dụng ở chế độ development
CMD ["yarn", "run", "start:dev"]

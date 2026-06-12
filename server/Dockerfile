FROM node:18-alpine

# ສ້າງ directory ໃນ container
WORKDIR /app

# Copy package files ແລະ install dependencies
COPY package*.json ./
RUN npm install

# Copy code ທັງໝົດເຂົ້າໄປ
COPY . .

# Port ທີ່ API ລັນ (ຕາມທີ່ທ່ານຕັ້ງໄວ້ໃນ .env)
EXPOSE 8001

CMD ["node", "server.js"]
# build environment
FROM node as build

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# react app
FROM nginx

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

CMD ["nginx", "-g", "daemon off;"]

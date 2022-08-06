FROM node:latest

EXPOSE 8080

RUN mkdir /app
RUN mkdir /public
WORKDIR /app
COPY . /app
COPY ./public /app/public

RUN npm install

CMD if [ "$NODE_ENV" = "development" ]; \
  then npm run dev;  \
  else npm run start; \
  fi

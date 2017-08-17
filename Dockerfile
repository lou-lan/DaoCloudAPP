FROM daocloud.io/library/node
MAINTAINER Zhai Huailou <loualn@loulan.me>

#在容器中创建一个目录
RUN mkdir -p /usr/src/app

#将容器的工作目录定位到 /usr/src/app中
WORKDIR /usr/src/app

COPY NodeJS/ /usr/src/app
RUN npm install

EXPOSE 8888

CMD [ "npm", "start" ]

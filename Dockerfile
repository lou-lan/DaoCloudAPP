FROM FROM daocloud.io/node:0.12.0-wheezy
MAINTAINER Zhai Huailou <loualn@loulan.me>

#在容器中创建一个目录
RUN mkdir -p /home/Service

#将容器的工作目录定位到 /home/Service中
WORKDIR /home/Service

COPY ./NodeJS /home/Service  
RUN npm install

EXPOSE 8888

CMD [ "npm", "start" ]

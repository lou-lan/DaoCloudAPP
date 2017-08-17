FROM FROM daocloud.io/library/node
MAINTAINER Zhai Huailou <loualn@loulan.me>

#在容器中创建一个目录
RUN mkdir -p /var/Service

#将容器的工作目录定位到 /var/Service中
WORKDIR /var/Service

COPY NodeJS/ /var/Service  
RUN npm install

EXPOSE 8888

CMD [ "npm", "start" ]

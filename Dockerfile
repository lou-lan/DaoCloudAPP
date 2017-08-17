FROM FROM daocloud.io/library/node:0.12.0-wheezy
MAINTAINER Zhai Huailou <loualn@loulan.me>

#在容器中创建一个目录
RUN mkdir -p /var/Service

#将容器的工作目录定位到 /var/Service中
WORKDIR /vae/Service

COPY /NodeJS/ /var/Service  
RUN npm install

EXPOSE 8888

CMD [ "npm", "start" ]

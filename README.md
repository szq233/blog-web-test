# blog-web-test
learn build blog webserver api

1、Install MySQL; set MySQL's connection to 127.0.0.1:3306;set user and password;import mysql dump data;

2、Install Redis; use default config(port:6379);use dump.rdb to replace the local dump.rdb;

3、Install Nginx; use this files' nginx-conf;

4、Change ./src/conf/db.js by your local db config;

5、Start MySQL, Redis and Nginx;

6、`cd ./blog-main`;

7、Run `npm i`; Run `npm run dev`;

8、Run `npm i http-server -g`; cd ./html-test; Run http-server -p 8001;

9、Enter the browser, input http://127.0.0.1:8080/index.html or .html files in html-test;

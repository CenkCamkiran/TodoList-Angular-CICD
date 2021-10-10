#FROM nginx:alpine
#COPY dist/todo-app /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 90
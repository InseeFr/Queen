FROM node:13 as node
WORKDIR /queen
COPY ./ /queen/
RUN yarn
RUN yarn build-docker

FROM nginx
COPY --from=node /queen/build /usr/share/nginx/html
RUN rm etc/nginx/conf.d/default.conf
# Overload nginx.conf to enable cors
COPY nginx.conf etc/nginx/conf.d/


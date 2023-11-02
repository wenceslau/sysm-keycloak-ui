# Use an official Nginx image as the base image
FROM nginx:alpine
#FROM steebchen/nginx-spa:stable

# Copy the built Angular app to the appropriate location in the container
COPY ./dist/wncsl-ui /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d

# Expose port 80 for the Nginx server
EXPOSE 80

# Start the Nginx server when the container starts
#CMD ["nginx"]
CMD ["nginx", "-g", "daemon off;"]

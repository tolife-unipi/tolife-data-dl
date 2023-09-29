# ==== CONFIGURE =====
FROM node:16-alpine 
WORKDIR /app
COPY ./ ./

LABEL maintainer="UNIPI"

# ==== BUILD =====
RUN npm ci 
RUN npm run build

# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000
# Start the app
CMD [ "npx", "serve", "build" ]
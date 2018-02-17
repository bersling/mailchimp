FROM node:8

COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json
COPY src /app/src
WORKDIR /app
ENV NODE_ENV development
RUN npm install
RUN npm run build
ENV NODE_ENV production
RUN npm install

EXPOSE 52502
HEALTHCHECK CMD curl --fail http://localhost:52502/ || exit 1
CMD ["npm", "start"]

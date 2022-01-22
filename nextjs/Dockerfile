FROM node:16-alpine as BUILD_IMAGE

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

# install dependencies
RUN yarn install --frozen-lockfile

COPY . .

# build
RUN yarn build

# remove dev dependencies
# RUN npm prune --production

FROM node:16-alpine

WORKDIR /usr/src/app

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app .

EXPOSE 3000
CMD ["yarn", "dev"]
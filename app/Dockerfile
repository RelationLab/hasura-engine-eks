FROM hasura/graphql-engine:v2.17.0-ce.cli-migrations-v3.ubuntu
ADD metadata /hasura-metadata
#ADD migrations /hasura-migrations
CMD ["graphql-engine", "serve"]
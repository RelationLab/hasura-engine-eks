FROM hasura/graphql-engine:v2.30.1.cli-migrations-v3.ubuntu
ADD metadata /hasura-metadata
#ADD migrations /hasura-migrations
CMD ["graphql-engine", "serve"]

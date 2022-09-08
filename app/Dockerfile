FROM hasura/graphql-engine:v2.11.1.cli-migrations-v3
ADD metadata /hasura-metadata
#ADD migrations /hasura-migrations
CMD ["graphql-engine", "serve"]
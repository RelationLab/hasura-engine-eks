import { appEnv } from "./env";
import { hasuraMetadataRds } from "./rds";
import { secret } from "./secret";

export const awsSecretId = secret.id;
export const dataSyncSecretId = appEnv.dataSyncStackRef.getOutput("awsSecretId");

export const ecrRepositoryName = appEnv.name;
export const ecrRepositoryUrl = appEnv.awsEcrStackRef.apply((stack) =>
  stack.getOutput("ecrRepositories").apply((repos) => repos[appEnv.name])
);

export const dataSyncDatabaseName = appEnv.dataSyncStackRef.getOutput("rdsDatabaseName");
export const dataSyncDatabaseAddress =
  appEnv.dataSyncStackRef.getOutput("rdsDatabaseAddress");

export const hasuraMetadataDatabaseName = hasuraMetadataRds.dbName;
export const hasuraMetadataDatabaseAddress = hasuraMetadataRds.address;

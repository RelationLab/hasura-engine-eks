import { dataSyncStack, secretId } from "./base";
import { ecrRepository } from "./ecr";
import { hasuraMetadataRds } from "./rds";

export const hasuraEngineSecretId = secretId;
export const dataSyncSecretId = dataSyncStack.getOutput("awsSecretId");

export const hasuraEngineRepositoryName = ecrRepository.name;
export const hasuraEngineRepositoryUrl = ecrRepository.repositoryUrl;

export const dataSyncDatabaseName = dataSyncStack.getOutput("rdsDatabaseName");
export const dataSyncDatabaseAddress = dataSyncStack.getOutput(
  "rdsReplicationDatabaseAddress"
);

export const hasuraMetadataDatabaseName = hasuraMetadataRds.dbName;
export const hasuraMetadataDatabaseAddress = hasuraMetadataRds.address;

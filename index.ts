import {dbSecretId, metadataDbSecretId} from "./base";
import {ecrRepository} from "./ecr";
import {hasuraEngineRds, hasuraMetadataRds} from "./rds";

export const hasuraEngineDbSecretId = dbSecretId;
export const hasuraEngineMetadataDbSecretId = metadataDbSecretId;

export const hasuraEngineRepositoryName = ecrRepository.name;
export const hasuraEngineRepositoryUrl = ecrRepository.repositoryUrl;

export const hasuraEngineDatabaseName = hasuraEngineRds.dbName;
export const hasuraEngineDatabaseAddress = hasuraEngineRds.address;

export const hasuraMetadataDatabaseName = hasuraMetadataRds.dbName;
export const hasuraMetadataDatabaseAddress = hasuraMetadataRds.address;
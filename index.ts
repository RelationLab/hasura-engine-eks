import {ecrRepository} from "./ecr";
import {hasuraEngineRds, hasuraMetadataRds} from "./rds";

export const hasuraEngineRepository = {
    url: ecrRepository.repositoryUrl,
    name: ecrRepository.name,
};

export const hasuraEngineDatabase = {
    name: hasuraEngineRds.dbName,
    address: hasuraEngineRds.address,
    port: hasuraEngineRds.port,
};

export const hasuraMetadataDatabase = {
    name: hasuraMetadataRds.dbName,
    address: hasuraMetadataRds.address,
    port: hasuraMetadataRds.port,
};

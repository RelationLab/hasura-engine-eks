import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

const dbName = config.get("dbName") || "relation";
const maintainer = config.require("maintainer");
const dbPassword = config.requireSecret("dbPassword");
const metadataDbPassword = config.requireSecret("metadataDbPassword");

export const baseConfig = {
    dbName,
    dbPassword,
    metadataDbPassword,
    maintainer,
};

export const baseTags = {
    Name: `hasura-engine-${pulumi.getStack()}`,
    Project: "Relation",
    PulumiStack: pulumi.getStack(),
};


const dbSecret = new aws.secretsmanager.Secret("hasura-engine-db");

dbPassword.apply((dbPassword) => {
    new aws.secretsmanager.SecretVersion("hasura-engine-db-password", {
        secretId: dbSecret.id,
        secretString: JSON.stringify({
            "password": dbPassword,
        }),
    });
});

export const dbSecretId = dbSecret.id;

const metadataDbSecret = new aws.secretsmanager.Secret("hasura-engine-metadata-db");

metadataDbPassword.apply((dbPassword) => {
    new aws.secretsmanager.SecretVersion("hasura-engine-metadata-db-password", {
        secretId: metadataDbSecret.id,
        secretString: JSON.stringify({
            "password": dbPassword,
        }),
    });
});

export const metadataDbSecretId = metadataDbSecret.id;
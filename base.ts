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

const secret = new aws.secretsmanager.Secret("hasura-engine");

pulumi.all([dbPassword, metadataDbPassword]).apply(([dbPassword, metadataDbPassword]) => {

    new aws.secretsmanager.SecretVersion("hasura-engine-db-password", {
        secretId: secret.id,
        secretString: JSON.stringify({
            "dbPassword": dbPassword,
            "metadataDbPassword": metadataDbPassword,
        }),
    });
});

export const secretId = secret.id;
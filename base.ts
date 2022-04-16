import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const stack = pulumi.getStack();
const config = new pulumi.Config();

const dbName = config.get("dbName") || "relation";
const maintainer = config.require("maintainer");
const hasuraAdminSecret = config.getSecret("hasuraAdminSecret");
const metadataDbPassword = config.requireSecret("metadataDbPassword");

export const baseConfig = {
    dbName,
    metadataDbPassword,
    maintainer,
};

export const baseTags = {
    Name: `hasura-engine-${pulumi.getStack()}`,
    Project: "Relation",
    PulumiStack: pulumi.getStack(),
};

const secret = new aws.secretsmanager.Secret("hasura-engine");

pulumi.all([metadataDbPassword, hasuraAdminSecret]).apply(([metadataDbPassword, hasuraAdminSecret]) => {

    new aws.secretsmanager.SecretVersion("hasura-engine-db-password", {
        secretId: secret.id,
        secretString: JSON.stringify({
            "metadataDbPassword": metadataDbPassword,
            "hasuraAdminSecret": hasuraAdminSecret || "",
        }),
    });
});

export const secretId = secret.id;
export const networkingStack = new pulumi.StackReference(`${maintainer}/relation-networking/${stack}`);
export const dataSyncStack = new pulumi.StackReference(`${maintainer}/relation-data-sync/${stack}`);
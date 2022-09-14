import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const stack = pulumi.getStack();
const config = new pulumi.Config();

const dbName = config.get("dbName") || "relation";
const maintainer = config.require("maintainer");
const hasuraAdminSecret = config.getSecret("hasuraAdminSecret");
const metadataDbPassword = config.requireSecret("metadataDbPassword");

const baseName = "hasura-engine";

export const baseConfig = {
  stack,
  dbName,
  metadataDbPassword,
  maintainer,
};

export const baseTags = {
  BaseName: baseName,
  Name: `${baseName}-${stack}`,
  Project: "Wired.network",
  PulumiStack: `Pulumi-${stack}`,
};

const secret = new aws.secretsmanager.Secret(baseName);

pulumi
  .all([metadataDbPassword, hasuraAdminSecret])
  .apply(([metadataDbPassword, hasuraAdminSecret]) => {
    new aws.secretsmanager.SecretVersion("hasura-engine-db-password", {
      secretId: secret.id,
      secretString: JSON.stringify({
        metadataDbPassword: metadataDbPassword,
        hasuraAdminSecret: hasuraAdminSecret || "",
      }),
    });
  });

export const secretId = secret.id;
export const networkingStack = new pulumi.StackReference(
  `${maintainer}/relation-networking/dev`
);
export const dataSyncStack = new pulumi.StackReference(
  `${maintainer}/relation-data-sync/dev`
);

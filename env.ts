import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const stack = pulumi.getStack();
const config = new pulumi.Config();

const dbName = config.get("dbName") || "relation";
const maintainer = config.require("maintainer");

export const tags = {
  Name: `hasura-engine-${stack}`,
  Project: "Wired.network",
  PulumiStack: `Pulumi-${stack}`,
};


export const appEnv = {
  name: "wired-hasura-engine",
  stack,
  dbName,
  maintainer,
  metadataDbPassword: config.requireSecret("metadataDbPassword"),
  hasuraAdminSecret: config.getSecret("hasuraAdminSecret"),
  awsEcrStackRef: aws
    .getRegionOutput()
    .apply(
      (res) =>
        new pulumi.StackReference(`${maintainer}/wired-aws-ecr/${res.name}`)
    ),
  networkingStackRef: new pulumi.StackReference(
    `${maintainer}/relation-networking/dev`
  ),
  dataSyncStackRef: new pulumi.StackReference(
    `${maintainer}/relation-data-sync/dev`
  )
};


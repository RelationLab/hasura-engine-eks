import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { tags, appEnv } from "./env";

export const secret = new aws.secretsmanager.Secret(tags.Name);

pulumi
    .all([appEnv.metadataDbPassword, appEnv.hasuraAdminSecret])
    .apply(([metadataDbPassword, hasuraAdminSecret]) => {
        new aws.secretsmanager.SecretVersion("hasura-engine-db-password", {
            secretId: secret.id,
            secretString: JSON.stringify({
                metadataDbPassword: metadataDbPassword,
                hasuraAdminSecret: hasuraAdminSecret || "",
            }),
        });
    });

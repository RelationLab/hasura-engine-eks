import * as aws from "@pulumi/aws";
import * as random from "@pulumi/random";
import {baseTags, baseConfig, networkingStack} from "./base";

const dataVpcSubnetIds = networkingStack.getOutput("dataVpcPrivateSubnetIds");

const subnetGroup = new aws.rds.SubnetGroup(baseTags.Name, {
    subnetIds: dataVpcSubnetIds,
    tags: baseTags,
});

const finalSnapshotIdentifier = new random.RandomString("finalSnapshotIdentifierRandom", {
    length: 16,
    special: false,
}).result;

const enhancedMonitoringRole = new aws.iam.Role(baseTags.Name, {
    assumeRolePolicy: {
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Principal: {
                Service: "monitoring.rds.amazonaws.com",
            },
            Effect: "Allow",
            Sid: ""
        }],
    },
    tags: baseTags,
});

export const hasuraMetadataRds = new aws.rds.Instance(`${baseTags.Name}-metadata`, {
    tags: baseTags,
    engine: "postgres",
    engineVersion: "14.1",
    allocatedStorage: 5,
    instanceClass: "db.t3.small",
    backupRetentionPeriod: 7,
    backupWindow: "00:00-01:00",
    maintenanceWindow: "Mon:02:00-Mon:04:00",
    monitoringInterval: 30,
    monitoringRoleArn: enhancedMonitoringRole.arn,
    username: "postgres",
    password: baseConfig.metadataDbPassword,
    dbName: "metadata",
    finalSnapshotIdentifier,
    storageType: "gp2",
    skipFinalSnapshot: false,
    dbSubnetGroupName: subnetGroup.name,
    vpcSecurityGroupIds: [networkingStack.getOutput("peeredSecurityGroupId")],
}, {ignoreChanges: ["monitoringInterval"]});
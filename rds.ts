import * as aws from "@pulumi/aws";
import * as random from "@pulumi/random";
import { tags, appEnv } from "./env";

const subnetGroup = new aws.rds.SubnetGroup(tags.Name, {
  subnetIds: appEnv.networkingStackRef.getOutput("dataVpcPrivateSubnetIds"),
  tags,
});

const securityGroup = new aws.ec2.SecurityGroup(tags.Name, {
  vpcId: appEnv.networkingStackRef.getOutput("dataVpcId"),
  ingress: [
    {
      fromPort: 5432,
      toPort: 5432,
      protocol: "tcp",
      cidrBlocks: [
        appEnv.networkingStackRef.getOutput("eksVpcCidrBlock"),
        appEnv.networkingStackRef.getOutput("dataVpcCidrBlock"),
      ],
    },
  ],
  tags,
});


const finalSnapshotIdentifier = new random.RandomString(
  "finalSnapshotIdentifierRandom",
  {
    length: 16,
    special: false,
  }
).result;

const enhancedMonitoringRole = new aws.iam.Role(tags.Name, {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: {
          Service: "monitoring.rds.amazonaws.com",
        },
        Effect: "Allow",
        Sid: "",
      },
    ],
  },
  tags,
});

export const hasuraMetadataRds = new aws.rds.Instance(
  `${tags.Name}-metadata`,
  {
    engine: "postgres",
    engineVersion: "14.7",
    allocatedStorage: 5,
    instanceClass: "db.t3.micro",
    backupRetentionPeriod: 0,
    maintenanceWindow: "Mon:02:00-Mon:04:00",
    monitoringInterval: 30,
    monitoringRoleArn: enhancedMonitoringRole.arn,
    username: "postgres",
    password: appEnv.metadataDbPassword,
    dbName: "metadata",
    finalSnapshotIdentifier,
    storageType: "gp2",
    skipFinalSnapshot: true,
    dbSubnetGroupName: subnetGroup.name,
    vpcSecurityGroupIds: [securityGroup.id],
    tags,
  },
  { ignoreChanges: ["monitoringInterval"] }
);

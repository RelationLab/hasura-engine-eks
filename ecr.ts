import * as aws from "@pulumi/aws";
import { baseConfig, baseTags } from "./base";

let ecr;

if (baseConfig.stack == "prod") {
  ecr = new aws.ecr.Repository(baseTags.BaseName, {
    name: baseTags.BaseName,
    tags: baseTags,
  });

  new aws.ecr.RepositoryPolicy(
    baseTags.Name,
    {
      repository: ecr.id,
      policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "new policy",
            Effect: "Allow",
            Principal: "*",
            Action: [
              "ecr:GetDownloadUrlForLayer",
              "ecr:BatchGetImage",
              "ecr:BatchCheckLayerAvailability",
              "ecr:PutImage",
              "ecr:InitiateLayerUpload",
              "ecr:UploadLayerPart",
              "ecr:CompleteLayerUpload",
              "ecr:DescribeRepositories",
              "ecr:GetRepositoryPolicy",
              "ecr:ListImages",
              "ecr:DeleteRepository",
              "ecr:BatchDeleteImage",
              "ecr:SetRepositoryPolicy",
              "ecr:DeleteRepositoryPolicy",
            ],
          },
        ],
      }),
    },
    { deleteBeforeReplace: true }
  );

  new aws.ecr.LifecyclePolicy(
    baseTags.Name,
    {
      repository: ecr.id,
      policy: JSON.stringify({
        rules: [
          {
            rulePriority: 1,
            description: "Expire images older than 14 days",
            selection: {
              tagStatus: "untagged",
              countType: "sinceImagePushed",
              countUnit: "days",
              countNumber: 14,
            },
            action: {
              type: "expire",
            },
          },
        ],
      }),
    },
    { deleteBeforeReplace: true }
  );
} else {
  ecr = aws.ecr.Repository.get(baseTags.BaseName, baseTags.BaseName);
}

export const ecrRepository = ecr;

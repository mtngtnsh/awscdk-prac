import { App, Duration, Stack, StackProps } from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'

export class Deployment extends Stack {
  constructor(
    readonly scope: App,
    readonly id: string,
    readonly props: StackProps
  ) {
    super(scope, id, props)

    const deployableRole = new iam.Role(this, 'DeployableRole', {
      maxSessionDuration: Duration.hours(3),
      assumedBy: new iam.ArnPrincipal(
        'arn:aws:iam::{}:user/GitHubActions'
      ),
      externalIds: [
        secretsmanager.Secret.fromSecretNameV2(
          this,
          'ExternalId',
          'AwsCdkDeployerExternalId'
        ).secretValue.toString(),
      ],
      managedPolicies: [
        {
          managedPolicyArn:
            'arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier',
        },
        {
          managedPolicyArn:
            'arn:aws:iam::aws:policy/AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy',
        },
      ],
    })

    const sessionTaggingPolicy = new iam.PolicyStatement()
    sessionTaggingPolicy.addPrincipals(
      new iam.ArnPrincipal('arn:aws:iam::{}:user/GitHubActions')
    )
    sessionTaggingPolicy.addActions('sts:TagSession')
    sessionTaggingPolicy.effect = iam.Effect.ALLOW
    deployableRole.assumeRolePolicy?.addStatements(sessionTaggingPolicy)

    const deployablePolicy = new iam.Policy(this, 'DeployablePolicy')
    deployablePolicy.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'cloudformation:*',
          'iam:PassRole',
          'ssm:GetParameter',
          'ec2:Describe*',
          'ec2:List*',
        ],
        resources: ['*'],
      })
    )
    deployablePolicy.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:*'],
        resources: [
          'arn:aws:s3:::cdktoolkit-stagingbucket-*',
          'arn:aws:s3:::cdk-*-assets-*',
        ],
      })
    )
    deployablePolicy.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['*'],
        conditions: {
          'ForAnyValue:StringEquals': {
            'aws:CalledVia': ['cloudformation.amazonaws.com'],
          },
        },
        resources: ['*'],
      })
    )
    deployablePolicy.attachToRole(deployableRole)
  }
}

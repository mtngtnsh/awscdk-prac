import { Duration } from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import { CloudWatchLogs } from './cloudWatchLogs'

export class LambdaFunction extends Construct {
  readonly lambdaFunction: lambda.Function

  constructor(
    readonly scope: Construct,
    readonly id: string,
    readonly props: Omit<lambda.FunctionProps, 'runtime'> &
      Partial<lambda.FunctionProps>
  ) {
    super(scope, id)

    this.lambdaFunction = new lambda.Function(this, 'Lambda', {
      memorySize: 128,
      timeout: Duration.seconds(60),
      runtime: lambda.Runtime.NODEJS_16_X,
      ...props,
    })

    new CloudWatchLogs(this, 'CloudWatchLogs', {
      logGroupName: `/aws/lambda/${this.lambdaFunction.functionName}`,
    })
  }
}

import { RemovalPolicy } from 'aws-cdk-lib'
import * as logs from 'aws-cdk-lib/aws-logs'
import { Construct } from 'constructs'

export class CloudWatchLogs extends Construct {
  readonly logGroup: logs.LogGroup

  constructor(
    readonly scope: Construct,
    readonly id: string,
    readonly props: logs.LogGroupProps
  ) {
    super(scope, id)

    this.logGroup = new logs.LogGroup(this, 'LogGroup', {
      retention: 90,
      removalPolicy: RemovalPolicy.DESTROY,
      ...props,
    })
  }
}

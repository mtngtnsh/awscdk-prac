import { Construct } from 'constructs'
import { App } from 'aws-cdk-lib'

export const getContext = (cdkCore: App | Construct, key: string): string => {
  const environment: string = cdkCore.node.tryGetContext('env')
  return cdkCore.node.tryGetContext(environment)[key]
}

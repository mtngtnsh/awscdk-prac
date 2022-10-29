import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { getContext } from './modules/contextUtils'
import { Deployment } from './components/stacks/deployment'

const app = new cdk.App()
const stackProps = {
  env: {
    account: getContext(app, 'accountId'),
    region: getContext(app, 'region'),
  },
}

new Deployment(app, 'awsCdkDeployment', stackProps)

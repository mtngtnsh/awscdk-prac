import * as ssm from 'aws-cdk-lib/aws-ssm'
import { Construct } from 'constructs'

interface StringParameterFromOptions {
  construct: Construct
  parameterName: string
  stringValue: string
}

export const stringParameterFrom = (
  options: StringParameterFromOptions
): void => {
  const { construct, parameterName, stringValue } = options

  new ssm.StringParameter(construct, parameterName, {
    parameterName,
    stringValue,
  })
}

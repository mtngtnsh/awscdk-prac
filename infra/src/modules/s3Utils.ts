import * as iam from 'aws-cdk-lib/aws-iam'
import * as s3 from 'aws-cdk-lib/aws-s3'

export const addNoneTlsDenyPolicy = (bucket: s3.Bucket) => {
  bucket.addToResourcePolicy(
    new iam.PolicyStatement({
      sid: 'AllowSSLRequestsOnly',
      actions: ['s3:*'],
      resources: [bucket.bucketArn, bucket.arnForObjects('*')],
      principals: [new iam.StarPrincipal()],
      conditions: {
        Bool: {
          'aws:SecureTransport': 'false',
        },
      },
      effect: iam.Effect.DENY,
    })
  )
}

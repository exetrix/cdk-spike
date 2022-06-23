import { Duration, Stack } from "aws-cdk-lib";
import { Policy, } from "aws-cdk-lib/aws-iam";
import { Function, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { join } from "path";
export interface LambdaEnvironmentVariables {
  [key: string]: string
}

export interface LambdaWithDynamoAccessProps {
  handler: string,
  policy: Policy,
  environment: LambdaEnvironmentVariables,
}

export class LambdaWithDynamoAccess extends Construct {

  public readonly functionReference: Function;

  constructor(scope: Construct, id: string, props: LambdaWithDynamoAccessProps) {
    super(scope, id);

    this.functionReference = this.createLambda(props.handler, props.environment);

    this.assignLambdaPolicies(props.policy);
  }

  private createLambda = (handler: string, environment: LambdaEnvironmentVariables): Function => {
    const stack = Stack.of(this);

    return new Function(this, 'LambdaFunction', {
      runtime: Runtime.NODEJS_14_X,
      memorySize: 1024,
      timeout: Duration.seconds(30),
      handler: handler,
      code: Code.fromAsset(join(__dirname, '/../../src/')),
      environment: {
        REGION: stack.region,
        AVAILABILITY_ZONES: JSON.stringify(
          stack.availabilityZones,
        ),
        ...environment
      },
    })
  }

  private assignLambdaPolicies = (policy: Policy): void => {
    this.functionReference.role?.attachInlinePolicy(policy);
  }
}
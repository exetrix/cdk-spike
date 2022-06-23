import { App, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { LambdaEnvironmentVariables, LambdaWithDynamoAccess } from './constructs/lambda-with-dynamo-access';

export class CdkSpikeStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const dynamoTable = this.createTable();

    const lambdaPolicy = this.createLambdaPolicy(dynamoTable);

    const lambdaEnvironment: LambdaEnvironmentVariables = {
      DYNAMO_TABLE_NAME: dynamoTable.tableName
    };

    const { functionReference: getLambdaFunction } = new LambdaWithDynamoAccess(
      this, 
      'GetLambdaFunction', 
      { handler: 'index.get', policy: lambdaPolicy, environment: lambdaEnvironment }
    );
    const { functionReference: putLambdaFunction } = new LambdaWithDynamoAccess(
      this, 
      'PutLambdaFunction', 
      { handler: 'index.put', policy: lambdaPolicy, environment: lambdaEnvironment }
    );

    const restApi = this.createRestApi();

    this.createApiEndpoints(restApi, getLambdaFunction, putLambdaFunction);
  }

  private createTable = (): Table => {
    return new Table(this, `DynamoTable`, {
      tableName: 'ExampleTable',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
    });
  }

  private createRestApi = (): RestApi => {
    return new RestApi(this, `ExampleApi`, {
      description: 'Customers API',
      deployOptions: {
        stageName: 'dev'
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'PUT', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000'],
      },
    });
  }

  private createApiEndpoints = (restApi: RestApi, getLambdaFunction: Function, putLambdaFunction: Function): void => {
    const rootResource = restApi.root.addResource('example');
    const singleEndpoint = rootResource.addResource('{id}');

    singleEndpoint.addMethod('GET', new LambdaIntegration(getLambdaFunction));

    singleEndpoint.addMethod('PUT', new LambdaIntegration(putLambdaFunction));
  }

  private createLambdaPolicy = (dynamoTable: Table): Policy => {
    const dynamoPermissionPolicy = new PolicyStatement({
      actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      resources: [dynamoTable.tableArn],
    });

    return new Policy(this, `DynamoTablePermissions`, {
      statements: [dynamoPermissionPolicy],
    });
  }
}

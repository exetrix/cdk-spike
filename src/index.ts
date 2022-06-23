import { APIGatewayProxyHandler } from "aws-lambda";
import { env } from "process";
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const tableName = <string> env.DYNAMO_TABLE_NAME;
const endpoint = <string> env.LOCALSTACK_HOSTNAME;
const client = new DocumentClient({ endpoint: `http://${endpoint}:4566`});

export const get: APIGatewayProxyHandler = async (event) => {

    let result = await client.get({ TableName: tableName, Key: { id: <string> event.pathParameters?.id } }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
    }
} 

export const put: APIGatewayProxyHandler = async (event) => {

    let record = JSON.parse(<string> event.body);

    let result = await client.put({ TableName: tableName, Item: record }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ record, meta: result }),
    }
} 
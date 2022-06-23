# CDK Spike

## Outline
The aim of this spike was to explore the functionality provided by the AWS CDK for the development and deployment of cloud native services. This project creates lambda functions to operate on a DynamoDB table. Requests are proxied to the lambda functions by an API Gateway - all resources are provisioned by the CDK.

## Structure
There are a number of files and locations that are important:
- `lib/` contains the CDK stacks and example construct
- `src/` houses the lambda code 
**Note:** project structure wasn't within the scope of the spike and should be discussed further

## Installation

### CDK
```
npm i -g aws-cdk
```

### LocalStack
Follow installation instructions [here](https://github.com/localstack/localstack)
Start localstack
```
localstack start -d
```
Install the cdk localstack wrapper
```
npm install -g aws-cdk-local
```

### Deployment
Either compile the typescript once (`npm run build`) or run watch (`npm run watch`)

Bootstrap the deployment - this only needs to be done once
```
cdklocal bootstrap
```
Then deploy using 
```
cdklocal deploy
```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkSpikeStack } from '../lib/cdk-spike-stack';

const app = new cdk.App();
new CdkSpikeStack(app, 'CdkSpikeStack');

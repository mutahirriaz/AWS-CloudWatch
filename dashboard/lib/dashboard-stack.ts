import * as cdk from '@aws-cdk/core';
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import lambda = require('@aws-cdk/aws-lambda');

export class DashboardStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const lambdaFn = new lambda.Function(this, "lambdaFn", {
      code: lambda.Code.fromAsset('lambda'),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
    });

    const errors = lambdaFn.metricErrors({
      statistic: 'avg',
      period: cdk.Duration.minutes(1),
    });

    const duration = lambdaFn.metricDuration();

    const dash = new cloudwatch.Dashboard(this, "dash");

    const widget = new cloudwatch.GraphWidget({
      title: "Execution vs Error rate",

      left: [errors],
      right: [duration],

      view: cloudwatch.GraphWidgetView.BAR,
      liveData: true,
    });

    const textWidget = new cloudwatch.TextWidget({
      markdown: "Lambda Performance Indecator"
    });

    dash.addWidgets(textWidget);
    dash.addWidgets(widget);

  }
}

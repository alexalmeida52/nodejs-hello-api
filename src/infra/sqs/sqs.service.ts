import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    SQSClient,
    ReceiveMessageCommand,
    DeleteMessageCommand,
    SendMessageCommand,
    Message
} from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService implements OnModuleInit {
    private readonly logger = new Logger(SqsService.name);
    private sqsClient: SQSClient;
    private queueReceiveUrl: string;
    private awsEnpoint: string;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.initializeSqsClient();
    }

    private initializeSqsClient() {
        const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
        const sessionToken = this.configService.get<string>('AWS_SESSION_TOKEN');


        const clientConfig: any = {
            region: region,
        };

        if (accessKeyId && secretAccessKey) {
            clientConfig.credentials = {
                accessKeyId,
                secretAccessKey,
                ...(sessionToken && { sessionToken }),
            };
        }

        clientConfig.endpoint = this.configService.get<string>('AWS_ENDPOINT_URL');
        clientConfig.tls = false;
        clientConfig.forcePathStyle = true; 

        this.sqsClient = new SQSClient(clientConfig);
        this.queueReceiveUrl = clientConfig.endpoint + this.configService.get<string>('AWS_SQS_QUEUE_NAME');
        this.awsEnpoint = clientConfig.endpoint;

        if (!this.queueReceiveUrl) {
            this.logger.warn('AWS_SQS_QUEUE_URL not configured');
        }

        this.logger.debug('SQS CONFIG', { queueUrl: this.queueReceiveUrl, region });
    }

    async receiveMessages(): Promise<Message[]> {
        if (!this.queueReceiveUrl) {
            throw new Error('SQS queue URL not configured');
        }

        try {
            const command = new ReceiveMessageCommand({
                QueueUrl: this.queueReceiveUrl,
                MaxNumberOfMessages: 10,
                WaitTimeSeconds: 20,
                MessageAttributeNames: ['All'],
                AttributeNames: ['All'],
            });

            const response = await this.sqsClient.send(command);
            return response.Messages || [];
        } catch (error) {
            this.logger.error('Error receiving messages from SQS:', error);
            throw error;
        }
    }

    async deleteMessage(receiptHandle: string): Promise<void> {
        if (!this.queueReceiveUrl) {
            throw new Error('SQS queue URL not configured');
        }

        try {
            const command = new DeleteMessageCommand({
                QueueUrl: this.queueReceiveUrl,
                ReceiptHandle: receiptHandle,
            });

            await this.sqsClient.send(command);
            this.logger.log('Message deleted successfully');
        } catch (error) {
            this.logger.error('Error deleting message from SQS:', error);
            throw error;
        }
    }

    private async sendMessage(queueName: string, messageBody: string, messageAttributes?: any): Promise<string> {
        if (!this.sqsClient || !this.sqsClient.config || !this.sqsClient.config.endpoint || !queueName) {
            throw new Error('SQS endpoint URL not configured');
        }

        if (!messageBody || typeof messageBody !== 'string') {
            throw new Error('Message body must be a non-empty string');
        }

        try {
            const queueSendUrl = this.awsEnpoint + queueName;
            this.logger.debug(`Sending message to ${queueSendUrl}`);
            const command = new SendMessageCommand({
                QueueUrl: queueSendUrl,
                MessageBody: messageBody,
                MessageAttributes: messageAttributes,
            });

            const response = await this.sqsClient.send(command);

            // Validação robusta do MessageId
            if (!response.MessageId) {
                this.logger.warn('SQS response received but MessageId is undefined', response);
                throw new Error('Failed to get MessageId from SQS response');
            }

            if (typeof response.MessageId !== 'string') {
                this.logger.warn('SQS returned non-string MessageId', response);
                throw new Error('Invalid MessageId received from SQS');
            }

            this.logger.log(`Message sent successfully. MessageId: ${response.MessageId}`);

            return response.MessageId;
        } catch (error) {
            this.logger.error('Error sending message to SQS:', error);
            throw error;
        }
    }

    async sendJsonMessage(queueName: string, messageData: any, messageAttributes?: Record<string, any>): Promise<string> {
        const messageBody = JSON.stringify(messageData);
        return this.sendMessage(queueName, messageBody, messageAttributes);
    }
}
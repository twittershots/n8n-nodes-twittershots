import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestOptions,
	NodeApiError,
} from 'n8n-workflow';
import { Buffer } from 'buffer';

export class TwitterShots implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TwitterShots',
		name: 'twitterShots',
		icon: 'file:TwitterShotsLogo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Get Tweet screenshots from TwitterShots API',
		defaults: {
			name: 'TwitterShots',
		},
		inputs: [
			{
				type: NodeConnectionType.Main,
				required: true,
			},
		],
		outputs: [
			{
				type: NodeConnectionType.Main,
				required: true,
			},
		],
		credentials: [
			{
				name: 'twitterShotsApi',
				required: true,
			},
		],
		// requestDefaults can be kept to set the base URL for all requests
		requestDefaults: {
			baseURL: 'https://api.twittershots.com',
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Tweet Screenshot',
						value: 'tweetScreenshot',
					},
				],
				default: 'tweetScreenshot',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['tweetScreenshot'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a tweet screenshot',
						description: 'Get a screenshot of a tweet',
						// ✨ 2. Remove the routing property here for a pure programmatic style
					},
				],
				default: 'get',
			},
			{
				displayName: 'Tweet ID',
				name: 'statusId',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'The ID of the tweet to screenshot',
				description: 'The ID of the tweet to screenshot',
				displayOptions: {
					show: {
						resource: ['tweetScreenshot'],
						operation: ['get'],
					},
				},
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				default: 'svg',
				description: 'The format of the screenshot, svg(default) or png or html',
				options: [
					{
						name: 'SVG',
						value: 'svg',
					},
					{
						name: 'PNG',
						value: 'png',
					},
					{
						name: 'HTML',
						value: 'html',
					},
				],
				// ✨ 2. Remove the routing property here
				displayOptions: {
					show: {
						resource: ['tweetScreenshot'],
						operation: ['get'],
					},
				},
			},
			{
				displayName: 'Theme',
				name: 'theme',
				type: 'options',
				default: 'light',
				description: 'The theme of the screenshot, light(default) or dark',
				options: [
					{
						name: 'Light',
						value: 'light',
					},
					{
						name: 'Dark',
						value: 'dark',
					},
				],
				// ✨ 2. Remove the routing property here
				displayOptions: {
					show: {
						resource: ['tweetScreenshot'],
						operation: ['get'],
					},
				},
			},
			{
				displayName: 'Logo',
				name: 'logo',
				type: 'options',
				default: 'x',
				description: 'The logo of the screenshot, x(default) or bluebird or none',
				options: [
					{
						name: 'X (Twitter)',
						value: 'x',
					},
					{
						name: 'Bluebird',
						value: 'bluebird',
					},
					{
						name: 'None',
						value: 'none',
					},
				],
				// ✨ 2. Remove the routing property here
				displayOptions: {
					show: {
						resource: ['tweetScreenshot'],
						operation: ['get'],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				description: 'Additional fields to include in the screenshot',
				displayOptions: {
					show: {
						resource: ['tweetScreenshot'],
						operation: ['get'],
					},
				},
				options: [
					{
						displayName: 'Show Full Text',
						name: 'showFullText',
						description: 'Whether to show the full text of the tweet',
						type: 'boolean',
						default: true,
						// ✨ 2. Remove the routing property here
					},
					{
						displayName: 'Show Timestamp',
						name: 'showTimestamp',
						description: 'Whether to show the timestamp of the tweet',
						type: 'boolean',
						default: true,
						// ✨ 2. Remove the routing property here
					},
					{
						displayName: 'Show Views',
						name: 'showViews',
						description: 'Whether to show the views count of the tweet',
						type: 'boolean',
						default: true,
						// ✨ 2. Remove the routing property here
					},
					{
						displayName: 'Show Stats',
						name: 'showStats',
						type: 'boolean',
						description: 'Whether to show the statistics of the tweet',
						default: true,
						// ✨ 2. Remove the routing property here
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			// ✨ 3. Wrap all logic in a try...catch block for proper error handling
			try {
				const statusId = this.getNodeParameter('statusId', i) as string;
				const format = this.getNodeParameter('format', i) as string;
				const theme = this.getNodeParameter('theme', i) as string;
				const logo = this.getNodeParameter('logo', i) as string;
				const additionalFields = this.getNodeParameter('additionalFields', i, {}) as {
					showFullText?: boolean;
					showTimestamp?: boolean;
					showViews?: boolean;
					showStats?: boolean;
				};

				const queryParams = {
					format,
					theme,
					logo,
					...additionalFields,
				};

				// ✨ 4. Build an options object conforming to IHttpRequestOptions
				const options: IHttpRequestOptions = {
					method: 'GET',
					// The baseURL is defined in requestDefaults, so we use a relative path here
					url: `https://api.twittershots.com/api/v1/screenshot/${statusId}`,
					qs: queryParams,
					headers: {
						Accept:
							format === 'svg' ? 'image/svg+xml' : format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'text/html',
					},
					// For binary files, setting encoding to 'arraybuffer' is important
					encoding: (format === 'html') ? 'text' : 'arraybuffer',
					// We need the full response to access the binary data from the body
					returnFullResponse: true,
				};

				// ✨ 5. Use httpRequestWithAuthentication to automatically handle authentication
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'twitterShotsApi',
					options,
				);

				let executionData: INodeExecutionData;

				if (format === 'html') {
          executionData = {
						json: {
							html: response.body,
						},
						pairedItem: {
							item: i,
						},
					};
				} else {
					// ✨ 6. FIX: Build the return data with the correct top-level structure
					executionData = {
						json: {},
						binary: {
							data: await this.helpers.prepareBinaryData(
								Buffer.from(response.body as string, 'binary'),
								`tweet.${format}`,
							),
						},
						pairedItem: {
							item: i,
						},
					};
				}
				returnData.push(executionData);
			} catch (error) {
				// ✨ 3. Implement proper error handling
				if (this.continueOnFail()) {
					// If the user configured the node to continue on error, return the error message
					const errorData: INodeExecutionData = {
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					};
					returnData.push(errorData);
					continue;
				}
				// Otherwise, throw a standardized n8n error
				throw new NodeApiError(this.getNode(), error, { itemIndex: i });
			}
		}

		return this.prepareOutputData(returnData);
	}
}
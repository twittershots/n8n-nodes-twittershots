
import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class TwitterShots implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TwitterShots',
		name: 'TwitterShots',
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
				name: 'TwitterShotsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.twittershots.com',
			headers: {
				Accept: 'image/svg+xml,image/png,text/html',
				'Content-Type': 'image/svg+xml,image/png,text/html',
			},
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
				description: 'Resource to consume',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'tweetScreenshot',
						],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a tweet screenshot',
						description: 'Get a screenshot of a tweet',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/v1/screenshot/{{$parameter["statusId"]}}',
							},
						},
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
				description: 'The ID of the tweet to screenshot',
				displayOptions: {
					show: {
						resource: [
							'tweetScreenshot',
						],
						operation: [
							'get',
						],
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
				routing: {
					request: {
						qs: {
							format: '={{$value}}',
						},
					},
				},
				displayOptions: {
					show: {
						resource: [
							'tweetScreenshot',
						],
						operation: [
							'get',
						],
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
				routing: {
					request: {
						qs: {
							theme: '={{$value}}',
						},
					},
				},
				displayOptions: {
					show: {
						resource: [
							'tweetScreenshot',
						],
						operation: [
							'get',
						],
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
				routing: {
					request: {
						qs: {
							logo: '={{$value}}',
						},
					},
				},
				displayOptions: {
					show: {
						resource: [
							'tweetScreenshot',
						],
						operation: [
							'get',
						],
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
						resource: [
							'tweetScreenshot',
						],
						operation: [
							'get',
						],
					},
				},
				options: [
					{
						displayName: 'Show Full Text',
						name: 'showFullText',
						description: 'Show the full text of the tweet, default is true',
						type: 'boolean',
						default: true,
						routing: {
							request: {
								qs: {
									showFullText: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'Show Timestamp',
						name: 'showTimestamp',
						description: 'Show the timestamp of the tweet, default is true',
						type: 'boolean',
						default: true,
						routing: {
							request: {
								qs: {
									showTimestamp: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'Show Views',
						name: 'showViews',
						description: 'Show the views of the tweet, default is true',
						type: 'boolean',
						default: true,
						routing: {
							request: {
								qs: {
									showViews: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'Show Stats',
						name: 'showStats',
						type: 'boolean',
						description: 'Show the stats of the tweet, default is true',
						default: true,
						routing: {
							request: {
								qs: {
									showStats: '={{$value}}',
								},
							},
						},
					},
				],
			},
		],
	};
}
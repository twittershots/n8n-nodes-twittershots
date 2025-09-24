import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TwitterShotsApi implements ICredentialType {
	name = 'twitterShotsApi';
	displayName = 'TwitterShots API';
	documentationUrl = 'https://twittershots.com/docs/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your TwitterShots API key from Account Settings',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.twittershots.com',
			url: '/api/v1/usage',
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};
}

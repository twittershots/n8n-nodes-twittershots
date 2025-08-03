import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TwitterShotsApi implements ICredentialType {
	name = 'TwitterShotsApi';
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
	authenticate = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	} as IAuthenticateGeneric;
}

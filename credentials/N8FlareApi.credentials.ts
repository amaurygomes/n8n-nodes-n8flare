import {
	ICredentialTestRequest,
	ICredentialType,
	IDataObject,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

export class N8FlareApi implements ICredentialType {
	name = 'n8flareApi';
	displayName = 'Cloudflare (N8Flare) API';
	icon = 'file:n8flare.v2.svg' as const;
	documentationUrl = 'https://n8flare.com/docs/auth';
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.cloudflare.com/client/v4',
			url: '={{ "/accounts/" + $credentials.accountId + "/workers/scripts" }}',
		},
	};
	async authenticate(
		credentials: IDataObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		requestOptions.headers = requestOptions.headers || {};
		const token = String(credentials.apiToken || '').trim();
		const email = String(credentials.accountEmail || '').trim();
		const authType = (credentials.authType as string) || 'apiToken';

		if (authType === 'globalApiKey' || (email && /^[0-9a-f]{37}$/i.test(token))) {
			requestOptions.headers['X-Auth-Email'] = email;
			requestOptions.headers['X-Auth-Key'] = token;
		} else {
			requestOptions.headers['Authorization'] = `Bearer ${token}`;
		}
		return requestOptions;
	}
	properties: INodeProperties[] = [
		{
			displayName: 'Auth Type',
			name: 'authType',
			type: 'options',
			options: [
				{
					name: 'API Token (Workers Edit)',
					value: 'apiToken',
					description: 'Token criado no painel da Cloudflare com permissão de Workers Scripts',
				},
				{
					name: 'Global API Key',
					value: 'globalApiKey',
					description: 'Chave Global API Key da conta Cloudflare (requer Account Email)',
				},
			],
			default: 'apiToken',
		},
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'string',
			default: '',
			required: true,
			description: 'O Account ID da sua conta na Cloudflare (encontrado na barra lateral direita de Workers & Pages)',
		},
		{
			displayName: 'API Token / Key',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Cloudflare API Token (com permissões de Workers) OU a Global API Key',
		},
		{
			displayName: 'Account Email',
			name: 'accountEmail',
			type: 'string',
			default: '',
			placeholder: 'name@example.com',
			description: 'E-mail da sua conta Cloudflare (obrigatório se estiver usando Global API Key, opcional para API Token)',
		},
	];
}

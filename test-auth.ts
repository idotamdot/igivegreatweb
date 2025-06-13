import {GoogleAuth} from 'google-auth-library';

async function testAuth() {
	const auth = new GoogleAuth({
		keyFile: './credentials/neural-web-labs-service-account.json',
		scopes: ['https://www.googleapis.com/auth/cloud-platform'],
	});

	const client = await auth.getClient();
	const projectId = await auth.getProjectId();

	console.log('Authenticated client:', client);
	console.log('Project ID:', projectId);
}

testAuth().catch(console.error);

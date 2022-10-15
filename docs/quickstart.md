# StackQL Middleware Quickstart

Use the [docker-compose.yml](../docker-compose.yml) file included with this repository to get up and running quickly with the following architecture:  

<center>
<img src="https://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/stackql/stackql-middleware/main/puml/stackql-docker-compose.puml" alt="StackQL Middleware Docker Compose Environment" width="80%"/>
</center>

The quickstart includes the following components:  

- [StackQL Server](https://github.com/stackql/stackql)
- [StackQL Playground](https://github.com/stackql/stackql-playground)
- [StackQL Middleware Server](../README.md)

## Providers

Using this quickstart example you can connect to and query any of the following StackQL public cloud/SaaS providers available from the [`stackql-provider-registry`](https://github.com/stackql/stackql-provider-registry):  

- [AWS](https://registry.stackql.io/providers/aws/)
- [Microsoft Azure](https://registry.stackql.io/providers/azure/)
- [Google Cloud Platform](https://registry.stackql.io/providers/google/)
- [Kubernetes](https://registry.stackql.io/providers/k8s/)
- [GitHub](https://registry.stackql.io/providers/github/)
- [Okta](https://registry.stackql.io/providers/okta/)
- [Netlify](https://registry.stackql.io/providers/netlify/)

## Steps

This quick start uses [docker compose v2](https://docs.docker.com/compose/).  

1. __Populate Environment Variables for Provider Authentication__

Populate the following environment variables where required (for a provider for which you have credentials and want to query):  

- `GITHUB_CREDS` (base64 encoded value of the GitHub username and Personal Acces Token)

Then export a variable named `AUTH_STR` which will be passed to the stackql server.  A complete example using GitHub credentials is shown here:  

```bash
export GITHUB_CREDS=$(echo -n 'yourusername:ghp_YOURPERSONALACCESSTOKEN' | base64)
export AUTH_STR='{ "github": { "type": "basic", "credentialsenvvar": "GITHUB_CREDS" }}'
```

```powershell
$Env:GITHUB_CREDS = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("yourusername:ghp_YOURPERSONALACCESSTOKEN"))
$Env:AUTH_STR = "{ 'github': { 'type': 'basic', 'credentialsenvvar': 'GITHUB_CREDS' } }"
```

2. __Start Environment__

Run the following command in the same environment you used in Step 1 to populate yor environment variables:  

```bash
docker compose up --build
```

3. __Use the Playground__

Use the Playground __Explorer__ pane to discover and describe available service and resources.  

Enter a StackQL query in the __Query__ pane, then..  

Use the __*Run Query*__ button to run the query and see the results in the __Results__ pane; and/or  

[![StackQL Playground Query](images/playground-query.png)](images/playground-query.png)

Use the __*Get Types*__ button to get the TypeScript types for the result set.  

[![StackQL Playground Types](images/playground-types.png)](images/playground-types.png)

Use the query and the types in your application.  

4. __Use the Middleware API__

The middleware API is accessible through port `8080`, you can use Postman, `curl`, or any other client library such as `node-fetch` or `axios` to run StackQL queries against this endpoint and return results as `application/json` responses.  

Meta routes such as:  

- `/providers`
- `/providers/{providerName}/services`
- `/providers/{providerName}/services/{serviceName}/resources`
- `/providers/{providerName}/services/{serviceName}/resources/{resourceName}`
- `/providers/{providerName}/services/{serviceName}/resources/{resourceName}/methods`

are accessible using `GET` requests as shown here:  

[![StackQL Meta Queries](images/stackql-postman-meta-queries.png)](images/stackql-postman-meta-queries.png)

You can run a StackQL (`SELECT`) query against a `provider`, `service`, `resource` using a `POST` request as shown here:  

[![StackQL Queries](images/stackql-postman-queries.png)](images/stackql-postman-queries.png)

5. __Stop the Environment__

Use `ctrl-c` to stop the environment.  

6. __Remove Containers__

Run the following command to remove the containers created in Step 2:  

```bash
docker compose down
```
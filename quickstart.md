# StackQL Middleware Quickstart

Use the [docker-compose.yml](docker-compose.yml) file included with this repository to get up and running quickly with the following architecture:  

<center>
<img src="https://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/stackql/stackql-middleware/main/puml/stackql-docker-compose.puml" alt="StackQL Middleware Docker Compose Environment" width="80%"/>
</center>

The quickstart includes the following components:  

- [StackQL Server](https://github.com/stackql/stackql)
- [StackQL Playground](https://github.com/stackql/stackql-playground)
- [StackQL Middleware Server](./README.md)

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

something

2. __Start Environment__

Run the following command in the same environment you used in Step 1 to populate yor environment variables:  

```bash
docker compose up --build
```

3. __Use the Playground__

something

4. __Use the Middleware API__

something

5. __Stop the Environment__

Use `ctrl-c` to stop the environment.  

6. __Remove Containers__

Run the following command to remove the containers created in Step 2:  

```bash
docker compose down
```
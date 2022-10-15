# StackQL Middleware Quickstart

Use the [docker-compose.yml](docker-compose.yml) file included with this repository to get up and running quickly with the following architecture:  

<center>
<img src="https://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/stackql/stackql-middleware/main/puml/stackql-docker-compose.puml" alt="StackQL Middleware Docker Compose Environment" width="90%"/>
</center>

The quickstart includes the following components:  

- [StackQL Server]()
- [StackQL Playground]()
- [StackQL Middleware Server]()

## Providers

Using this quickstart example you can connect to and query any of the following StackQL public cloud/SaaS providers available from the [`stackql-provider-registry`](https://github.com/stackql/stackql-provider-registry):  

- [AWS]()
- [Microsoft Azure]()
- [Google Cloud Platform]()
- [Kubernetes]()
- [GitHub]()
- [Okta]()
- [Netlify]()

## Steps

1. Populate Environment Variables for Provider Authentication
2. Start Environment
3. Use the Playground
4. Use the Middleware API
# StackQL Middleware

The StackQL middleware server is built on top of the [StackQL core](https://github.com/stackql/stackql), which includes a server (`stackql srv`) that serves clients using the Postgres wire protocol.  

> **Note:** The StackQL server is not a Postgres server, nor does it require one to be deployed.

------------------

## Features

* **Well Known Query Interface**: Intuitive SQL `SELECT` based query interface which supports attribute filtering, search, projection
* **Support for Mutations**: Create, update, and delete operations supported using SQL `INSERT`, `UPDATE`, and `DELETE` statements
* **Simplified Object Model**: Self-describing object model which presents developers with a database-*like* ORM, including support for metacommands such as `DESCRIBE` and `SHOW`
* **Standard Library of Functions**:  Support for built-in scalar functions consistent with those available in most DBMSs - including `string`, `date`, `math` and `json` functions
* **Intelligent API Client**: Complex queries (including `JOIN` and `GROUP BY` operations) are planned and executed as optimized DAGs, which can be executed in parallel if possible
* **Simple Views for Complex Queries**:  Complex, verbose or repetitive queries can be simplified using views, which can be session based using the `CREATE VIEW` command or added to the provider schema
* **Extensible Backends**: Support for backend providers which expose OpenAPI or GraphQL interfaces - seamless to the developer (you use SQL :smile:)
* **High Performance**: Lightning fast performance with support for query and result caching
* **Built-in Type Generation**: Capable of performing introspection on resources to generate client type libraries for your language of choice
* **Built-in Authorization, RBAC, and ABAC**: Fine grain authorization and access control using the `GRANT` and `REVOKE` commands - including support for row-level security

------------------

## Table of contents

- [Architecture](#architecture)
- [Example Usage](#example-usage)
- [Request Structure](#request-structure)
- [Response Structure](#response-structure)
    - [Without Metadata](#without-metadata)
    - [With Metadata](#with-metadata)
    - [With Errors](#with-errors)
- [Quickstart](#quickstart)
- [Generating a Provider](#generating-a-provider)

------------------

## Architecture

The StackQL middleware server enables clients to query api backends using a natural SQL language for providers installed with authentication configured in the StackQL server.  The StackQL server includes a front-end parser and query planner, which translates the SQL query into one or more REST and/or GraphQL requests and then executes the queries against the backends.  

Results can be operated on using SQL functions and operators (including grouping, windowing, and aggregation functions) and then returned to the client as a JSON response.  The following architecture diagram illustrates the StackQL middleware server's components.  


<center>
<img src="https://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/stackql/stackql-middleware/main/puml/stackql-middleware-context.puml" alt="StackQL Middleware Context" width="90%"/>
</center>

Detailed design documentation can be found [here](docs/detailed-design.md).  

## Example Usage


## Request Structure

StackQL queries are sent to the server using the `POST` method and the `application/json` content type.  The request body should contain a JSON object with the following properties:  

```json
{
  "query":"SELECT field1, field2 FROM provider.service.resource 
  WHERE param1 = '$var1' AND param2 = '$var2' AND param3 = $var3",
  "params":{
    "var1": "a",
    "var2": "b",
    "var3": 1
  },
  "showMetadata":true,
}
```

`showMetadata` is an optional property that, if set to `true`, will cause the server to return metadata about the query execution.  This includes the query plan, the number of rows returned, and the time to execute the query.  The default value is `false`.  

## Response Structure

Responses can include metadata and the results of a query or will return information about errors if they occur.  

### Without Metadata

If the `showMetadata` option is not set or set to `false`, the response will be a JSON array containing the query results.  The following example shows the response to a query that returns a single row with two columns:  

```json
{
  "data": [
    {
        "field1": "value1",
        "field2": "value2"
    }
  ],
}
```

### With Metadata

If the query was submitted with the `showMetadata` option set, additional information about the request and response will be returned.  An example is shown here:  

```json
{
  "data": [
    rows...
  ],
  "metadata": {
    "operation" : {
      "startTime": "2020-07-29T05:54:27.784837196Z",
      "endTime": "2020-07-29T05:54:27.787239465Z",
      "duration": "2.402269ms"
      "status": "OK"
    },
    "result": {
      "rowCount": 1
    },
    "request": {
      "query": "SELECT x FROM y WHERE a = '$var1' AND b = '$var2' AND c = $var3",
      "params": {
        "var1": "a",
        "var2": "b",
        "var3": 1
      },
      "renderedQuery": "SELECT x FROM y WHERE a = 'a' AND b = 'b' AND c = 1",
    }
  }
}
```

### With Errors

If there are errors in the execution of a query, a response similar to the following will be returned:  

```json
{
    "data": [],
    "errors": [
        {
            "message": "error message",
            "code": "error code",
            "details": "error details"
        }
    ]
}
```

## Quickstart

Here is a quick start guide to get you up and running with the StackQL middleware server.  

## Generating a Provider

Providers for any API backend can be generated using StackQL tools, including [stackql/openapi-doc-util](https://github.com/stackql/openapi-doc-util).


## Acknowledgements

This project is made possible by the following open source projects:
- [StackQL](https://github.com/stackql/stackql)
- [Deno Oak](https://deno.land/x/oak@v11.1.0)
- [Deno Postgres Driver](https://github.com/denodrivers/postgres)

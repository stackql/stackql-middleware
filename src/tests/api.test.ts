// tests/api.test.ts
import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";

const controllers: AbortController[] = [];

async function makeRequest(url: string, options?: RequestInit) {
  const controller = new AbortController();
  controllers.push(controller);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    const text = await response.text();
    try {
      return { response, data: JSON.parse(text) };
    } catch {
      return { response, data: text };
    }
  } catch (e) {
    if (controller.signal.aborted) throw e;
    throw e;
  }
}

Deno.test("API Integration Tests", async (t) => {
  try {
    await t.step("Health check returns 200", async () => {
      const { response, data } = await makeRequest("http://localhost:8080/health");
      assertEquals(response.status, 200);
      assertExists(data.status);
    });

    await t.step("Query execution - valid SELECT", async () => {
      const { response, data } = await makeRequest("http://localhost:8080/stackql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "SELECT * FROM github.repos.contributors WHERE repo = 'stackql' and owner = 'stackql'",
          showMetadata: true
        })
      });
      assertEquals(response.status, 200);
      assertExists(data.data);
      assertExists(data.metadata);
    });

    await t.step("Query execution - invalid query type", async () => {
      const { response, data } = await makeRequest("http://localhost:8080/stackql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "INSERT INTO aws.s3.buckets VALUES ('test')"
        })
      });
      assertEquals(response.status, 405);
      assertExists(data.error);
    });

    await t.step("Provider discovery", async () => {
      const { response, data } = await makeRequest("http://localhost:8080/providers");
      assertEquals(response.status, 200);
      assertExists(data.data);
    });

    await t.step("Service discovery", async () => {
      const { response, data } = await makeRequest("http://localhost:8080/providers/github/services");
      assertEquals(response.status, 200);
      assertExists(data.data);
    });

    await t.step("Query execution - DTS generation", async () => {
      const { response, data } = await makeRequest(
        "http://localhost:8080/stackql?dts=true", 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: "DESCRIBE EXTENDED aws.ec2.instances"
          })
        }
      );
      assertEquals(response.status, 200);
      assertEquals(response.headers.get("content-type"), "text/plain; charset=UTF-8");
      assertExists(data.includes("declare module namespace"));
      assertExists(data.includes("IRootObject"));
      assertExists(data.includes("name: string"));
    });
 
    await t.step("Query execution - metadata disabled", async () => {
      const { response, data } = await makeRequest(
        "http://localhost:8080/stackql",
        {
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: "SELECT * FROM github.repos.contributors WHERE repo = 'stackql' and owner = 'stackql'",
            showMetadata: false
          })
        }
      );
      assertEquals(response.status, 200);
      assertExists(data.data);
      assertEquals(data.metadata, undefined);
    });

  } finally {
    // Clean up all fetch requests
    controllers.forEach(controller => controller.abort());
    await t.step("cleanup", () => {});
  }
});
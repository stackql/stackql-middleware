// tests/duckdb.test.ts
import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";

const SQL_QUERY = `
  SELECT country_region AS country,
         CAST(SUM(confirmed) AS INTEGER) AS total_confirmed,
         CAST(SUM(deaths) AS INTEGER) AS total_deaths,
         COUNT(*) AS record_count
  FROM read_csv_auto('s3://covid19-lake/archived/enigma-jhu/csv/Enigma-JHU.csv.gz')
  GROUP BY country_region
  ORDER BY total_confirmed DESC
  LIMIT 5
`;

Deno.test("DuckDB Integration Tests", async (t) => {
  await t.step("Query execution - COVID-19 Dataset", async () => {
    const response = await fetch("http://localhost:8080/duckdb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: SQL_QUERY,
        showMetadata: true
      })
    });

    assertEquals(response.status, 200);
    
    const data = await response.json();
    assertExists(data.data);
    assertExists(data.metadata);
    assertEquals(Array.isArray(data.data), true);
    
    if (data.data.length > 0) {
      const firstRow = data.data[0];
      assertExists(firstRow.country);
      assertExists(firstRow.total_confirmed);
      assertExists(firstRow.total_deaths);
      assertExists(firstRow.record_count);
    }
  });
});

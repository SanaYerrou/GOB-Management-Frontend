import { querySourceEntities, queryLogs } from "../../src/graphql/queries";

var api, query;

jest.mock("graphql-request", () => ({
  request: jest.fn(async (_api, _query) => {
    api = _api;
    query = _query;
    return null;
  })
}));

describe("queries service", () => {
  it("retrieves all sources", async () => {
    var result;

    result = await querySourceEntities();
    expect(result).toBe(null);
    expect(query).toBe(`
  {
    sourceEntities {
      id
      source
      entity
    }
  }
  `);
  });

  it("retrieves all logs", async () => {
    var result;

    result = await queryLogs();
    expect(result).toBe(null);
    expect(query).toBe(`
  query {
    logs  {
      edges {
        node {
          source
          entity
          processId
          logid
          timestamp
          name
          level
          msg
          data
        }
      }
    }
  }
  `);
    expect(api).toBe(process.env.VUE_APP_API);

    result = await queryLogs("x", "y");
    expect(query).toBe(`
  query {
    logs (source: "x" entity: "y") {
      edges {
        node {
          source
          entity
          processId
          logid
          timestamp
          name
          level
          msg
          data
        }
      }
    }
  }
  `);
  });
});

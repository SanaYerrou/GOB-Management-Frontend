import { querySourceEntities, queryLogs } from "../../src/graphql/queries";
import { get_api } from "../../src/services/api";

var api, query;

jest.mock("../../src/services/request", () => ({
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
      catalogue
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
          destination
          catalogue
          entity
          processId
          logid
          timestamp
          name
          level
          msgid
          msg
          data
        }
      }
    }
  }
  `);
    expect(api).toBe(get_api() + "gob_management/graphql/");

    result = await queryLogs("x", "y");
    expect(query).toBe(`
  query {
    logs (source: "x" catalogue: "y" ) {
      edges {
        node {
          source
          destination
          catalogue
          entity
          processId
          logid
          timestamp
          name
          level
          msgid
          msg
          data
        }
      }
    }
  }
  `);
  });
});

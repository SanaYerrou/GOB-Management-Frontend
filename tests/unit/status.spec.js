import { services, isAlive, ALIVE_INTERVAL } from "../../src/services/status";

const mockServices = [];

jest.mock("graphql-request", () => ({
  request: jest.fn(async () => {
    return {
      services: {
        edges: mockServices.map(srv => ({
          node: srv
        }))
      },
      tasks: {
        edges: mockServices.map(srv => ({
          node: srv
        }))
      }
    };
  })
}));

describe("status service", () => {
  it("retrieves all services", async () => {
    var s;

    s = await services();
    expect(s.Workflow.name).toBe("Workflow");
    expect(s.BeheerAPI.name).toBe("BeheerAPI");
    expect(s.IRIS.name).toBe("IRIS");
    expect(Object.values(s).length).toBe(3);
  });

  it("can tell if a service is alive", async () => {
    var service = {
      isAlive: true,
      age: 0
    };
    expect(isAlive(service)).toBe(true);

    service = {
      isAlive: true,
      age: ALIVE_INTERVAL
    };
    expect(isAlive(service)).toBe(true);

    service = {
      isAlive: true,
      age: ALIVE_INTERVAL + 1
    };
    expect(isAlive(service)).toBe(false);

    service = {
      isAlive: false,
      age: 0
    };
    expect(isAlive(service)).toBe(false);

    service = null;
    expect(isAlive(service)).toBe(null);
  });
});

import { sources, entities, logs, jobRunsOnDate } from "../../src/services/gob";

const SOURCES = {
  EMPTY: [],
  ONE: [
    {
      source: "source",
      catalogue: "catalogue",
      entity: "entity"
    }
  ],
  MULTIPLE: [
    {
      source: "source1",
      catalogue: "catalogue",
      entity: "entity1"
    },
    {
      source: "source1",
      catalogue: "catalogue",
      entity: "entity2"
    },
    {
      source: "source2",
      catalogue: "catalogue",
      entity: "entity2"
    },
    {
      source: "source3",
      catalogue: "catalogue",
      entity: "entity2"
    }
  ]
};

const LOGS = {
  EMPTY: [],
  ONE: [
    {
      logid: 0,
      processID: 1,
      level: "level",
      data: '"null"'
    }
  ],
  MULTIPLE: [
    {
      logid: 0,
      processId: 1,
      level: "level1",
      data: '"null"'
    },
    {
      logid: 1,
      processId: 1,
      level: "level2",
      data: '"null"'
    },
    {
      logid: 2,
      processId: 2,
      level: "level",
      data: '"null"'
    },
    {
      logid: 3,
      processId: 2,
      level: "level",
      data: '"null"'
    },
    {
      logid: 4,
      processId: 3,
      level: "level",
      data: '"null"'
    }
  ]
};

var mockSources = SOURCES.EMPTY;
var mockLogs = LOGS.EMPTY;

jest.mock("../../src/services/request", () => ({
  request: jest.fn(async (api, query) => {
    if (query.includes("logs")) {
      return {
        logs: {
          edges: mockLogs.map(log => ({
            node: log
          }))
        }
      };
    } else {
      return {
        sourceEntities: mockSources
      };
    }
  })
}));

describe("gob service", () => {
  it("retrieves all sources", async () => {
    var s;

    mockSources = SOURCES.EMPTY;
    s = await sources();
    expect(s.length).toBe(0);

    mockSources = SOURCES.ONE;
    s = await sources();
    expect(s.length).toBe(1);

    mockSources = SOURCES.MULTIPLE;
    s = await sources();
    expect(s.length).toBe(3);
  });

  it("retrieves all entitities", async () => {
    var e;

    mockSources = SOURCES.EMPTY;
    e = await entities();
    expect(e.length).toBe(0);

    mockSources = SOURCES.ONE;
    e = await entities();
    expect(e.length).toBe(1);

    mockSources = SOURCES.MULTIPLE;
    e = await entities();
    expect(e.length).toBe(2);
  });

  it("retrieves all source entitities", async () => {
    var e;
    var source;

    mockSources = SOURCES.EMPTY;
    e = await entities();
    expect(e.length).toBe(0);

    source = "source";
    var catalogue = "catalogue";

    e = await entities(source);
    expect(e.length).toBe(0);

    mockSources = SOURCES.ONE;
    e = await entities(source, catalogue);
    expect(e.length).toBe(1);

    source = "source1";
    e = await entities(source);
    expect(e.length).toBe(0);

    mockSources = SOURCES.MULTIPLE;
    e = await entities(source);
    expect(e.length).toBe(2);

    source = "source2";
    e = await entities(source);
    expect(e.length).toBe(1);
  });

  it("retrieves all logs", async () => {
    var l;

    mockLogs = LOGS.EMPTY;
    l = await logs();
    expect(l.length).toBe(0);

    mockLogs = LOGS.ONE;
    l = await logs();
    expect(l.length).toBe(1);

    mockLogs = LOGS.MULTIPLE;
    l = await logs();
    expect(l.length).toBe(5);
  });

  it("tells if a job runs on a date", () => {
    var job;

    job = {
      starttime: new Date(2020, 2, 15),
      endtime: new Date(2020, 2, 16)
    };
    expect(jobRunsOnDate(job, new Date(2020, 2, 14))).toBe(false);
    expect(jobRunsOnDate(job, new Date(2020, 2, 15))).toBe(true);
    expect(jobRunsOnDate(job, new Date(2020, 2, 16))).toBe(true);
    expect(jobRunsOnDate(job, new Date(2020, 2, 17))).toBe(false);

    job = {
      starttime: new Date(2020, 2, 15),
      endtime: new Date(2020, 2, 15)
    };
    expect(jobRunsOnDate(job, new Date(2020, 2, 14))).toBe(false);
    expect(jobRunsOnDate(job, new Date(2020, 2, 15))).toBe(true);
    expect(jobRunsOnDate(job, new Date(2020, 2, 16))).toBe(false);
  });
});

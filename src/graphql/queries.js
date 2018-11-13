import { request } from "graphql-request";

const api = process.env.VUE_APP_API;

async function graphql(query) {
  return request(api, query);
}

export async function querySourceEntities() {
  const query = `
  {
    sourceEntities {
      id
      source
      catalogue
      entity
    }
  }
  `;
  return graphql(query);
}

function getLogsSelect(source, catalogue, entity) {
  var select = "";
  if (source || catalogue || entity) {
    var selectSource = source ? `source: "${source}"` : "";
    var selectCatalogue = catalogue ? `catalogue: "${catalogue}"` : "";
    var selectEntity = entity ? `entity: "${entity}"` : "";
    select = `(${selectSource} ${selectCatalogue} ${selectEntity})`;
  }
  return select;
}

export async function queryLogDays(source, catalogue, entity) {
  const select = getLogsSelect(source, catalogue, entity);
  const query = `
  {
    logDays ${select} {
      date
      job
      level
      count
    }
  }
  `;
  return graphql(query);
}

export async function queryJobs(filter = {}) {
  var filters = Object.entries(filter).filter(([k, v]) => v);

  var filterExpression = "";
  if (filters.length) {
    const expr =  filters.reduce((s, [k, v]) => s + `${k}:${v} `, "");
    filterExpression = `(${expr})`;
  }

  const query = `
  {
    jobs ${filterExpression} {
      processId,
      day,
      name,
      source,
      catalogue,
      entity,
      starttime,
      endtime,
      level,
      count
    }
  }
  `;
  return graphql(query);
}

async function _queryLogs(select) {
  const query = `
  query {
    logs ${select} {
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
  `;
  return graphql(query);
}

export async function queryLogsForJob(process_id) {
  const select = `(processId: "${process_id}")`;
  return _queryLogs(select);
}

export async function queryLogs(source, catalogue, entity) {
  const select = getLogsSelect(source, catalogue, entity);
  return _queryLogs(select);
}

import { request } from "graphql-request";

const api = process.env.VUE_APP_API;

async function graphql(query) {
  return request(api, query);
}

export async function querySourceEntities() {
  var query = `
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

export async function queryLogs(source, entity) {
  var select = "";
  if (source || entity) {
    var selectSource = source ? `source: "${source}"` : "";
    var selectEntity = entity ? `entity: "${entity}"` : "";
    select = `(${selectSource} ${selectEntity})`;
  }

  var query = `
  query {
    logs ${select} {
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
  `;
  return graphql(query);
}

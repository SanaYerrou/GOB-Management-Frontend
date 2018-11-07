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

export async function queryLogs(source, catalogue, entity) {
  var select = "";
  if (source || catalogue || entity) {
    var selectSource = source ? `source: "${source}"` : "";
    var selectCatalogue = catalogue ? `catalogue: "${catalogue}"` : "";
    var selectEntity = entity ? `entity: "${entity}"` : "";
    select = `(${selectSource} ${selectCatalogue} ${selectEntity})`;
  }

  var query = `
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

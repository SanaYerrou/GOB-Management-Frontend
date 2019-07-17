import { GraphQLClient } from "graphql-request";
import auth from "./auth";
import { get_api } from "./api";

export async function request(api, query) {
  const token = await auth.token();
  const headers = token
    ? {
        Authorization: "Bearer " + token
      }
    : {};
  const client = new GraphQLClient(api, { headers });
  return client.request(query);
}

export async function get(url, options = {}) {
  const token = await auth.token();
  return fetch(get_api() + url, {
    ...options,
    headers: {
      Authorization: "Bearer " + token,
      ...options.headers
    }
  });
}

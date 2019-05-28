import { GraphQLClient } from "graphql-request";
import auth from "./auth";

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

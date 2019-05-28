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

export async function get(url) {
  var xhr = new XMLHttpRequest();
  const token = await auth.token();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send();
  xhr.onreadystatechange = () =>
    console.log("Received", xhr.readyState, xhr.status, xhr.response);
}
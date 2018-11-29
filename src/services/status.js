import { queryServices } from "../graphql/queries";

export const SERVICES = ["Workflow", "Import", "Upload", "Export"];

export const ALIVE_INTERVAL = 60;

export async function services() {
  var allServices = await queryServices();
  return allServices.services.edges
    .map(edge => edge.node)
    .map(service => {
      const now = new Date();
      const nowUTC = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      );
      const timestamp = new Date(service.timestamp);
      service.age = (nowUTC - timestamp) / 1000;
      return service;
    });
}

export function isAlive(service) {
  return service && service.isAlive && service.age <= ALIVE_INTERVAL;
}

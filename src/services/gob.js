import _ from "lodash";
import moment from "moment-timezone";
import { get } from "./request";

import {
  querySourceEntities,
  queryLogDays,
  queryLogs,
  queryJob,
  queryJobs,
  queryLogsForJob,
  queryLogsForJobStep
} from "../graphql/queries";

export async function sources() {
  var data = await querySourceEntities();
  return _.uniq(
    data.sourceEntities.map(item => item.source).filter(source => source)
  );
}

export async function catalogues() {
  var data = await querySourceEntities();
  return _.uniq(
    data.sourceEntities
      .map(item => item.catalogue)
      .filter(catalogue => catalogue)
  );
}

export async function entities(source, catalogue) {
  var data = await querySourceEntities();
  data = data.sourceEntities.filter(item => item.source && item.catalogue);
  if (source) {
    data = data.filter(item => item.source === source);
  }
  if (catalogue) {
    data = data.filter(item => item.catalogue === catalogue);
  }
  return _.uniqBy(data, item => item.entity);
}

export async function logDays(source, catalogue, entity) {
  var logDays = await queryLogDays(source, catalogue, entity);
  return logDays.logDays;
}

function _logs(data) {
  var logs = data.logs.edges.map(edge => edge.node);
  logs.forEach(log => {
    log.data = JSON.parse(JSON.parse(log.data));
  });

  return logs;
}

export async function logs(source, catalogue, entity) {
  var data = await queryLogs(source, catalogue, entity);
  return _logs(data);
}

export async function logsForJob(process_id) {
  var data = await queryLogsForJob(process_id);
  return _logs(data);
}

export async function logsForJobStep(jobid, stepid) {
  var data = await queryLogsForJobStep(jobid, stepid);
  return _logs(data);
}

export async function getJob(id) {
  var data = await queryJob(id);

  var jobinfos = data.jobinfo;
  return jobinfos ? jobinfos[0] : null;
}

export async function createJob(action, catalogue, collection) {
  const application = {
    bouwblokken: "DGDialog",
    buurten: "DGDialog",
    wijken: "DGDialog",
    stadsdelen: "DGDialog"
  };

  action = action.toLowerCase().replace(" ", "_");
  catalogue = catalogue.toLowerCase();
  collection = collection.toLowerCase();

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action,
      catalogue,
      collection,
      application: application[collection],
      destination: "Objectstore"
    })
  };
  const result = await get("gob_management/job/", requestOptions);
  return {
    ok: result.ok,
    text: await result.text()
  };
}

function isZombie(job) {
  if (job.status === "started") {
    const runtime = moment
      .duration(moment(Date.now()).diff(moment(job.starttime)))
      .asHours();
    return runtime > 12;
  }
  return false;
}

export async function getJobs(filter) {
  var data = await queryJobs(filter);

  // Interpret any UTC date time that is received from the backend in the CET timezone
  var jobs = data.jobs
    .filter(job => job.processId)
    .map(job => ({
      ...job,
      date: new Date(
        moment(job.day)
          .tz("CET")
          .startOf("day")
      ),
      duration: moment.duration(moment(job.endtime).diff(moment(job.starttime)))
    }))
    .map(job => ({
      ...job,
      status: job.status === "started" && isZombie(job) ? "zombie" : job.status
    }));
  return jobs;
}

export function jobRunsOnDate(job, date) {
  // Interpret any UTC date time that is received from the backend in the CET timezone
  const startDate = moment(job.starttime)
    .tz("CET")
    .startOf("day");
  const endDate = moment(job.endtime || job.starttime)
    .tz("CET")
    .endOf("day");
  return startDate <= date && date <= endDate;
}

export function getSecure() {
  get("gob_management/secure/");
}

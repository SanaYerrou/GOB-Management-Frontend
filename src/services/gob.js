import _ from "lodash";
import moment from "moment";

import {
  querySourceEntities,
  queryLogDays,
  queryLogs,
  queryJobs,
  queryLogsForJob
} from "../graphql/queries";

export async function sources() {
  var data = await querySourceEntities();
  return _.uniq(data.sourceEntities.map(item => item.source).filter(source => source));
}

export async function catalogues() {
  var data = await querySourceEntities();
  return _.uniq(data.sourceEntities.map(item => item.catalogue).filter(catalogue => catalogue));
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

export async function getJobs(filter) {
  var data = await queryJobs(filter);

  // Jobs have an entry per level and count
  // Group the jobs on processId to get the list of jobs (processIds)
  var processIds = _.groupBy(data.jobs, "processId");

  // Determine the levels per processId
  var jobs = Object.entries(processIds).map(([, jobs]) => {
    // Take the information from the first job
    const job = jobs[0];
    // And compute the levels from the complete list of jobs
    return {
      ...job,
      date: new Date(moment(job.day).startOf("day")),
      levels: jobs.map(job => ({ level: job.level, count: job.count }))
    };
  });

  // Delete the level and count, they are replaced by levels
  jobs.forEach(job => {
    delete job.level;
    delete job.count;
  });

  return jobs;
}

export function jobRunsOnDate(job, date) {
  var startDate = moment(job.starttime).startOf("day");
  var endDate = moment(job.endtime).endOf("day");
  var onDate = new Date(date);
  return startDate <= onDate && onDate <= endDate;
}

import _ from "lodash";
import moment from "moment";

import { querySourceEntities, queryLogs } from "../graphql/queries";

export async function sources() {
  var data = await querySourceEntities();
  return _.uniq(data.sourceEntities.map(item => item.source));
}

export async function catalogues() {
  var data = await querySourceEntities();
  return _.uniq(data.sourceEntities.map(item => item.catalogue));
}

export async function entities(source) {
  var data = await querySourceEntities();
  data = data.sourceEntities;
  if (source) {
    data = data.filter(item => item.source === source);
  }
  return _.uniqBy(data, item => item.entity);
}

export async function logs(source, entity) {
  var data = await queryLogs(source, entity);

  var logs = data.logs.edges.map(edge => edge.node);
  logs.forEach(log => {
    log.data = JSON.parse(JSON.parse(log.data));
  });

  return logs;
}

export function jobs(logs) {
  var processIds = _.uniq(logs.map(log => log.processId));

  // Sort logs, oldest first
  logs = _.orderBy(logs, ["logid"]);

  return processIds.map(processId => {
    var jobLogs = logs.filter(log => log.processId === processId);
    return {
      startLog: jobLogs[0],
      endLog: jobLogs[jobLogs.length - 1],
      logLevels: _.uniq(jobLogs.map(log => log.level)),
      processId: jobLogs[0].processId,
      jobLogs
    };
  });
}

export function jobRunsOnDate(job, date) {
  var startDate = moment(job.startLog.timestamp).startOf("day");
  var endDate = moment(job.endLog.timestamp).endOf("day");
  var onDate = new Date(date);
  return startDate <= onDate && onDate <= endDate;
}

export function logLevels(jobs) {
  return _.groupBy(
    jobs.reduce((logs, job) => logs.concat(job.jobLogs), []),
    log => log.level
  );
}

export function jobsPerDate(jobs) {
  return _.groupBy(
    jobs,
    job => new Date(moment(job.startLog.timestamp).startOf("day"))
  );
}

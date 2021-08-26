function URL() {
  return "https://172.16.90.205/"
  //return process.env.REACT_APP_OPSTOOL_HOST;
}

export function URLs() {
  const urls = {
    DashboardServer: URL() + "patches/api/dashboard/serverwise/",
    Dashboard: URL() + "patches/api/dashboard/status/",
    DashboardDetails: URL() + "patches/api/dashboard/details/",

    MenuActive: URL() + "patches/api/menuactive/",

    Global: URL() + "patches/api/settings/",
    Backup: URL() + "patches/api/backup/",
    Monitor: URL() + "patches/api/monitor/",
    Servers: URL() + "patches/api/servers/",
    ServersUpload: URL() + "patches/api/server/upload/",
    ServersDownload: URL() + "patches/api/server/download/",
    ServerGroupTechnology: URL() + "patches/api/server/grouptechology/",
    TechnologyConfig: URL() + "patches/api/server/techologyconfig/",

    Technology: URL() + "patches/api/technology/",
    Severity: URL() + "patches/api/severity/",
    Criticality: URL() + "patches/api/criticality/",

    Patch: URL() + "patches/api/patches/",
    PatchTech: URL() + "patches/api/patches/tech/",
    PatchSeverity: URL() + "patches/api/patches/severity/",

    ItsmAPI: URL() + "patches/api/itsm-api/",
    ChangeApprove: URL() + "patches/api/job-change/approval/",
    Configuration: URL() + "patches/api/configuration/template/retrieve/",
    Scheduled: URL() + "patches/api/scheduled/server/",
    Scheduler: URL() + "patches/api/scheduler/",
    ActiveJobs: URL() + "patches/api/activejobs/",
    Jobs: URL() + "patches/api/jobs/",
    Summary: URL() + "patches/api/summary/",
    Validation: URL() + "patches/api/validation/",
    Path: URL() + "patches/api/validation/retrieve/path/",
    LogsPath: URL() + "patches/api/joblogs/retrieve/path/",

    DownloadXlsx: URL() + "patches/api/excelreports/download/get/",

    CompletedJobs: URL() + "patches/api/completedjobs/",
    CompletedServers: URL() + "patches/api/completedservers/",

    MonthlyJobs: URL() + "patches/api/analytics/monthlyjobs/",
  };
  return urls;
}

export function Cookies(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

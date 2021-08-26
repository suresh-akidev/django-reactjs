import { URLs } from "../../../Urls";

export function DynamicColumns(sw) {
  switch (sw) {
    case "Servers":
      return [
        { title: "Server", field: "server_name", width: "40%" },
        { title: "OS", field: "os_name", width: "40%" },
        { title: "Criticality", field: "criticality", width: "20%" },
        // { title: "IP", field: "ip_address", width: "30%" },
        // { title: "Credential", field: "credential_path", width: "30%" },
        // { title: "Backup", field: "backup_server", width: "30%" },
        // { title: "B.Enabled", field: "backup_enabled", width: "30%" },
        // { title: "Monitoring", field: "monitor_server", width: "30%" },
        // { title: "M.Enabled", field: "monitor_enabled", width: "30%" },
      ];
    case "ActiveJobs":
      return [
        { field: "summary_id", title: "Sum.ID", width: "10%" },
        { field: "job_id", title: "Job", width: "10%" },
        { field: "server_name", title: "Server Name", width: "30%" },
        { field: "patch_executiondate", title: "Date", width: "30%" },
        { field: "patch_id", title: "Patch ID", width: "20%" },
      ];
    case "Running":
      return [
        { field: "summary_id", title: "Sum.ID", width: "10%" },
        { field: "job_id", title: "Job", width: "10%" },
        { field: "server_name", title: "Server Name", width: "30%" },
        { field: "patch_executiondate", title: "Date", width: "30%" },
        { field: "patch_id", title: "Patch ID", width: "20%" },
      ];
    case "Scheduled":
      return [
        { field: "summary_id", title: "Sum.ID", width: "10%" },
        { field: "job_id", title: "Job", width: "10%" },
        { field: "server_name", title: "Server Name", width: "30%" },
        { field: "patch_executiondate", title: "Date", width: "30%" },
        { field: "patch_id", title: "Patch ID", width: "20%" },
      ];
    case "Success":
      return [
        { field: "summary_id", title: "Sum.ID", width: "10%" },
        { field: "job_id", title: "Job", width: "10%" },
        { field: "server_name", title: "Server Name", width: "30%" },
        { field: "patch_executiondate", title: "Date", width: "30%" },
        { field: "patch_id", title: "Patch ID", width: "20%" },
      ];
    case "Failed":
      return [
        { field: "summary_id", title: "Sum.ID", width: "10%" },
        { field: "job_id", title: "Job", width: "10%" },
        { field: "server_name", title: "Server Name", width: "30%" },
        { field: "patch_executiondate", title: "Date", width: "30%" },
        { field: "patch_id", title: "Patch ID", width: "20%" },
      ];
    default:
      return "";
  }
}

export function DynamicURL(sw, dropData) {
  switch (sw) {
    case "Servers":
      return URLs().Servers + "get/";
    case "ActiveJobs":
      return URLs().DashboardDetails + "ActiveJobs/" + dropData + "/";
    case "Running":
      return URLs().DashboardDetails + "Running/" + dropData + "/";
    case "Scheduled":
      return URLs().DashboardDetails + "Scheduled/" + dropData + "/";
    case "Success":
      return URLs().DashboardDetails + "Success/" + dropData + "/";
    case "Failed":
      return URLs().DashboardDetails + "Failed/" + dropData + "/";
    default:
      return "";
  }
}

export function DynamicFlag(sw) {
  switch (sw) {
    case "Servers":
      return false;
    case "ActiveJobs":
      return false;
    case "Scheduled":
      return false;
    case "Running":
      return true;
    case "Success":
      return true;
    case "Failed":
      return true;
    default:
      return false;
  }
}

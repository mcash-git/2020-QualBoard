import { enums } from '2020-qb4';
import { Api } from 'api/api';
import { growlProvider } from 'shared/growl-provider';
import downloadBlob from 'shared/utility/download-blob';

const ReportTypes = enums.reportTypes;

export class ReportService {
  static inject = [Api];

  constructor(api) {
    this.api = api;
  }

  verifyKind(kind) {
    if (typeof kind === 'string' || kind instanceof String) {
      return true;
    }
    growlProvider.error('Error', 'Kind must be of type string');
    return false;
  }

  createReport(report) {
    const type = ReportTypes[report.reportType.int];
    switch (type) {
      case ReportTypes.crossTab:
        this.createCrosstabReport(report);
        break;
      case ReportTypes.transcript:
        this.createTranscriptsReport(report);
        break;
      default:
        growlProvider.error('Error', 'No valid report kind found.');
        break;
    }
  }

  generateReport(report) {
    const type = ReportTypes[report.reportType];
    switch (type) {
      case ReportTypes.crossTab:
        this.startCrosstabJob(report.projectId, report.id);
        break;
      case ReportTypes.transcript:
        this.startTranscriptJob(report.projectId, report.id);
        break;
      default:
        growlProvider.error('Error', 'No valid report kind found.');
        break;
    }
  }

  async createCrosstabReport(report) {
    const result = await this.api.command.reports.createUpdateCrosstab(report);
    if (result.error) {
      growlProvider.error('Error', 'There was an error creating the Crosstab Report.');
      return false;
    }

    growlProvider.success('Success', 'Your crosstab report configuration has been saved.');
    return true;
  }

  async createTranscriptsReport(report) {
    const result = await this.api.command.reports.createUpdateTranscripts(report);
    if (result.error) {
      growlProvider.error('Error', 'There was an error creating the Transcript Report.');
      return false;
    }

    growlProvider.success('Success', 'Your transcript report configuration has been saved.');
    return true;
  }

  async startCrosstabJob(projectId, configId) {
    const jobId = await this.api.query.reporting
      .startCrosstabJob(projectId, configId);
    if (jobId) {
      growlProvider.success('Export Started', 'When your export is finished, it will be available in the downloads icon of the title bar');
    }
  }

  async startTranscriptJob(projectId, configId) {
    const jobId = await this.api.query.reporting
      .startTranscriptJob(projectId, configId);
    if (jobId) {
      growlProvider.success('Export Started', 'When your export is finished, it will be available in the downloads icon of the title bar');
    }
  }

  async downloadUserParticipation(projectId, iaId, fileName = 'Participation Export.xlsx') {
    const blob = await this.api.query.reporting.downloadParticipation(projectId, iaId);
    downloadBlob(blob, fileName);
  }

  async deleteReport(configurationId, projectId) {
    const result = await this.api.command.reports.deleteReport(configurationId, projectId);
    if (result.error) {
      growlProvider.error('Error', 'There was an error deleting the report');
      return false;
    }

    growlProvider.success('Success', 'Your report has been deleted');
    return true;
  }
}

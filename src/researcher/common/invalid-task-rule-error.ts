export interface IInvalidTaskRuleErrorDetails {
  taskId?:string;
  targetTaskId?:string;
  targetOptionId?:string;
  targetMatrixRowId?:string;
  targetMatrixColumnId?:string;
  rule:any;
}

export class InvalidTaskRuleError extends Error {
  constructor(msg:string, details:IInvalidTaskRuleErrorDetails) {
    super(msg);

    this.details = details;
  }

  details:IInvalidTaskRuleErrorDetails;
}

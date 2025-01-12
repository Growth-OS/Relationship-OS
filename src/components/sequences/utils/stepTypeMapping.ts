import { StepType, DatabaseStepType } from "../types";

export const mapDbStepTypeToFrontend = (dbType: DatabaseStepType, stepNumber: number): StepType => {
  if (dbType === "email") {
    return stepNumber % 2 === 1 ? "email_1" : "email_2";
  } else {
    if (stepNumber === 1) return "linkedin_connection";
    return stepNumber % 2 === 1 ? "linkedin_message_1" : "linkedin_message_2";
  }
};

export const mapFrontendStepTypeToDb = (frontendType: StepType): DatabaseStepType => {
  return frontendType.startsWith('email') ? "email" : "linkedin";
};
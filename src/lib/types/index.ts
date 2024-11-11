export type StarterProps = {
  name: string;
  description: string;
  link: string;
};

export enum UserType {
  INDIVIDUAL = "INDIVIDUAL",
  LEGAL = "LEGAL",
}

export enum CareerEvent {
  HIRED = "HIRED",
  PROMOTED = "PROMOTED",
  FIREWELL = "FIREWELL",
}

export interface JobItem {
  id: string;
  source?: string;
  text: string;
  careerEvent: CareerEvent;
  timestamp: number;
}

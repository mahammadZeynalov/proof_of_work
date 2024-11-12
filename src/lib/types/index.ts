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
  HIRED,
  PROMOTED,
  TERMINATED,
}

export interface JobItem {
  tokenId: string;
  text: string;
  careerEvent: CareerEvent;
  timestamp: number;
  source?: string;
}

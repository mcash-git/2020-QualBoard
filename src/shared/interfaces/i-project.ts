export interface IProject {
  accountId: string;
  activeEventCount: number;
  closeTime: string;
  events?: any[];
  id: string;
  inactiveEventCount: number;
  instructionMedia: any;
  instructionText: string;
  instructionTitle: string;
  instructions?: any; // i don't think this is necessary its a double up
  isActive: boolean;
  openTime: string;
  past24HourResponseCount: number;
  past48HourResponseCount: number;
  privateName: string;
  projectUserCount: number;
  publicName: string;
  timeZone: string;
  totalEventCount: number;
  totalResponseCount: number;
}

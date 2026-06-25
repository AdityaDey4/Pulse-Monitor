export type MonitorStatus =
  | "UP"
  | "DOWN"
  | "UNKNOWN";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH";

export interface MonitorType {
  id: number;
  userId: number;
  name: string;
  url: string;
  method: HttpMethod;
  status: MonitorStatus;
  intervalMinutes: number;
  successCriteriaIds: number[];
  isActive: boolean;
  lastCheckedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckResultType {
  id: number;
  monitorId: number;
  success: boolean;
  statusCode: number | null;
  responseTime: number | null;
  errorMessage: string | null;
  checkedAt: Date;
}
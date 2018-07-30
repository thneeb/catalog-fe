export interface Device {
  id: string;
  name: string;
  description: string;
}

export interface DeviceIoTState {
  id: string;
  name: string;
  credentials: any[];
  creationTime: number;
}

export interface DeviceState {
  devices: Device[];
  loading: boolean;
}

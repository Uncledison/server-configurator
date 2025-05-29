// 서버 타입 정의
export interface ServerType {
  name: string;
  manufacturer: string;
  formFactor: string;
  description: string;
  chassisTypes: string[];
  maxCpuSockets: number;
  maxMemorySlots: number;
  maxPciSlots: number;
  maxPower: number;
}

// CPU 타입 정의
export interface CpuType {
  id: number;
  name: string;
  manufacturer: string;
  series: string;
  frequency: string;
  cores: number;
  cache: string;
  power: number;
  compatible: boolean;
  notes?: string;
}

// GPU 타입 정의
export interface GpuType {
  id: number;
  name: string;
  manufacturer: string;
  memory: string;
  power: number;
  compatible: boolean;
}

// 메모리 타입 정의
export interface MemoryType {
  id: number;
  name: string;
  manufacturer: string;
  type: string;
  speed: string;
  capacity: number;
  compatible: boolean;
}

// 제약 조건 타입 정의
export interface ConstraintsType {
  maxCpu: number;
  maxMemoryModules: number;
  maxGpu: number;
  memoryPerProcessor: number;
  requiresSecondProcessorFor: {
    secondaryRiser: boolean;
    slots: number[];
  };
  powerSupplyOptions: {
    name: string;
    watts: number;
  }[];
}

// 서버 데이터 타입 정의
export interface ServerDataType {
  server: ServerType;
  compatibleParts: {
    cpu: CpuType[];
    gpu: GpuType[];
    memory: MemoryType[];
  };
  constraints: ConstraintsType;
}

// 부품 타입 정의
export type PartType = 'cpu' | 'gpu' | 'memory';

// 추가된 부품 상태 타입 정의
export interface AddedPartsType {
  cpu: number;
  gpu: number;
  memory: number;
}

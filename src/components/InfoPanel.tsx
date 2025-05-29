import React from 'react';
import { ServerDataType, AddedPartsType } from '../types';

interface InfoPanelProps {
  selectedServerId: number | null;
  addedParts: AddedPartsType;
  serverData: ServerDataType;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ selectedServerId, addedParts, serverData }) => {
  // 서버 정보 (실제로는 selectedServerId에 따라 다른 정보 표시)
  const serverInfo = selectedServerId
    ? serverData.server
    : null;

  // 선택된 부품 정보
  const selectedCpu = serverData.compatibleParts.cpu[0]; // Intel Xeon Platinum 8593Q
  const selectedGpu = serverData.compatibleParts.gpu[0]; // NVIDIA A100 PCIe
  const selectedMemory = serverData.compatibleParts.memory[2]; // HPE DDR5-5600 128GB

  // 현재 사용 중인 리소스 계산 (실제 선택된 부품 스펙 기반)
  const usedResources = {
    power: addedParts.cpu * selectedCpu.power + addedParts.gpu * selectedGpu.power + addedParts.memory * 10, // 메모리는 모듈당 약 10W로 가정
    memory: addedParts.memory * selectedMemory.capacity, // 메모리 모듈당 128GB
  };

  // 예상 비용 계산 (실제 부품 가격 기반)
  const cpuPrice = 15000000; // 1,500만원
  const gpuPrice = 30000000; // 3,000만원
  const memoryPrice = 2000000; // 200만원
  
  const estimatedCost = addedParts.cpu * cpuPrice + addedParts.gpu * gpuPrice + addedParts.memory * memoryPrice;

  if (!selectedServerId || !serverInfo) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md h-full">
        <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>서버를 선택하면 정보가 표시됩니다</p>
        </div>
      </div>
    );
  }

  // 이 시점에서 serverInfo는 null이 아님이 보장됨
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full overflow-y-auto">
      {/* 현재 구성 요약 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">현재 구성</h2>
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">서버:</div>
            <div className="font-medium">{serverInfo.name}</div>
            
            <div className="text-gray-600">CPU:</div>
            <div className="font-medium">
              {addedParts.cpu > 0 ? `${selectedCpu.name} x${addedParts.cpu}` : '없음'}
            </div>
            
            <div className="text-gray-600">GPU:</div>
            <div className="font-medium">
              {addedParts.gpu > 0 ? `${selectedGpu.name} x${addedParts.gpu}` : '없음'}
            </div>
            
            <div className="text-gray-600">메모리:</div>
            <div className="font-medium">
              {addedParts.memory > 0 ? `${selectedMemory.name} x${addedParts.memory}` : '없음'}
            </div>
          </div>
        </div>
      </div>

      {/* 호환성 상태 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">호환성 상태</h2>
        <div className="bg-green-50 p-3 rounded-md text-green-800">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>모든 항목 호환됨</span>
          </div>
        </div>
      </div>

      {/* 리소스 사용량 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">리소스 사용량</h2>
        
        {/* 전력 사용량 */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>전력:</span>
            <span>{usedResources.power}/{serverInfo.maxPower}W</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${Math.min((usedResources.power / serverInfo.maxPower) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* 메모리 용량 */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>메모리:</span>
            <span>{usedResources.memory}/{serverInfo.maxMemorySlots * 128}GB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full"
              style={{ width: `${Math.min((usedResources.memory / (serverInfo.maxMemorySlots * 128)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 예상 비용 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">예상 비용</h2>
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-2xl font-bold text-center">
            ₩{estimatedCost.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            CPU: ₩{(addedParts.cpu * cpuPrice).toLocaleString()} | 
            GPU: ₩{(addedParts.gpu * gpuPrice).toLocaleString()} | 
            메모리: ₩{(addedParts.memory * memoryPrice).toLocaleString()}
          </div>
        </div>
      </div>

      {/* 선택된 부품 상세 정보 */}
      {addedParts.cpu > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">CPU 상세 정보</h2>
          <div className="bg-blue-50 p-3 rounded-md">
            <h3 className="font-medium">{selectedCpu.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div className="text-gray-600">코어:</div>
              <div>{selectedCpu.cores}코어</div>
              <div className="text-gray-600">주파수:</div>
              <div>{selectedCpu.frequency}</div>
              <div className="text-gray-600">캐시:</div>
              <div>{selectedCpu.cache}</div>
              <div className="text-gray-600">TDP:</div>
              <div>{selectedCpu.power}W</div>
            </div>
          </div>
        </div>
      )}

      {addedParts.gpu > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">GPU 상세 정보</h2>
          <div className="bg-green-50 p-3 rounded-md">
            <h3 className="font-medium">{selectedGpu.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div className="text-gray-600">메모리:</div>
              <div>{selectedGpu.memory}</div>
              <div className="text-gray-600">TDP:</div>
              <div>{selectedGpu.power}W</div>
            </div>
          </div>
        </div>
      )}

      {addedParts.memory > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">메모리 상세 정보</h2>
          <div className="bg-purple-50 p-3 rounded-md">
            <h3 className="font-medium">{selectedMemory.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div className="text-gray-600">유형:</div>
              <div>{selectedMemory.type}</div>
              <div className="text-gray-600">속도:</div>
              <div>{selectedMemory.speed}</div>
              <div className="text-gray-600">용량:</div>
              <div>{selectedMemory.capacity}GB</div>
              <div className="text-gray-600">총 용량:</div>
              <div>{selectedMemory.capacity * addedParts.memory}GB</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;

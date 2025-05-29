import React from 'react';
import { ServerDataType, CpuType, GpuType, MemoryType } from '../types';

// 드래그 타입 정의
export const ItemTypes = {
  CPU: 'cpu',
  GPU: 'gpu',
  MEMORY: 'memory',
  SERVER: 'server'
};

interface PartLibraryProps {
  selectedServerId: number | null;
  onSelectServer: (serverId: number) => void;
  serverData: ServerDataType;
}

const PartLibrary: React.FC<PartLibraryProps> = ({ selectedServerId, onSelectServer, serverData }) => {
  // 탭 순서 변경: 서버, CPU, GPU, 메모리 순으로
  const [activeTab, setActiveTab] = React.useState<'server' | 'cpu' | 'gpu' | 'memory'>('server');

  // 서버 선택 핸들러
  const handleServerSelect = () => {
    onSelectServer(1); // HPE ProLiant DL380 Gen11은 ID 1로 고정
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">부품 라이브러리</h2>
      
      {/* 탭 메뉴 - 순서 변경: 서버, CPU, GPU, 메모리 */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'server' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('server')}
        >
          서버
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'cpu' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('cpu')}
          disabled={!selectedServerId}
        >
          CPU
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'gpu' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('gpu')}
          disabled={!selectedServerId}
        >
          GPU
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'memory' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('memory')}
          disabled={!selectedServerId}
        >
          메모리
        </button>
      </div>
      
      {/* 탭 내용 */}
      <div className="flex-grow overflow-y-auto">
        {activeTab === 'server' && (
          <div className="space-y-4">
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedServerId ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
              }`}
              onClick={handleServerSelect}
            >
              <div className="flex items-center mb-2">
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">{serverData.server.name}</h3>
                  <p className="text-sm text-gray-500">{serverData.server.manufacturer}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>{serverData.server.formFactor} | {serverData.server.maxCpuSockets}소켓 | 최대 {serverData.server.maxMemorySlots} DIMM</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'cpu' && selectedServerId && (
          <div className="space-y-4">
            {serverData.compatibleParts.cpu.map((cpu: CpuType) => (
              <div 
                key={cpu.id}
                className="p-4 border rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', ItemTypes.CPU);
                }}
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{cpu.name}</h3>
                    <p className="text-sm text-gray-500">{cpu.manufacturer}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
                  <p>코어: {cpu.cores}코어</p>
                  <p>주파수: {cpu.frequency}</p>
                  <p>캐시: {cpu.cache}</p>
                  <p>TDP: {cpu.power}W</p>
                </div>
                {cpu.notes && (
                  <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-1 rounded">
                    참고: {cpu.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'gpu' && selectedServerId && (
          <div className="space-y-4">
            {serverData.compatibleParts.gpu.map((gpu: GpuType) => (
              <div 
                key={gpu.id}
                className="p-4 border rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', ItemTypes.GPU);
                }}
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{gpu.name}</h3>
                    <p className="text-sm text-gray-500">{gpu.manufacturer}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
                  <p>메모리: {gpu.memory}</p>
                  <p>TDP: {gpu.power}W</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'memory' && selectedServerId && (
          <div className="space-y-4">
            {serverData.compatibleParts.memory.map((memory: MemoryType) => (
              <div 
                key={memory.id}
                className="p-4 border rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('type', ItemTypes.MEMORY);
                }}
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{memory.name}</h3>
                    <p className="text-sm text-gray-500">{memory.manufacturer}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
                  <p>유형: {memory.type}</p>
                  <p>속도: {memory.speed}</p>
                  <p>용량: {memory.capacity}GB</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 도움말 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        <p>부품을 캔버스로 드래그하여 서버를 구성하세요. 각 부품은 해당 영역에만 추가할 수 있습니다.</p>
      </div>
    </div>
  );
};

export default PartLibrary;

import React, { useState } from 'react';
import { ItemTypes } from './PartLibrary';
import { ServerDataType, PartType, AddedPartsType } from '../types';

interface CanvasProps {
  selectedServerId: number | null;
  addedParts: AddedPartsType;
  onAddPart: (type: PartType) => boolean;
  onRemovePart: (type: PartType) => boolean;
  serverData: ServerDataType;
}

const Canvas: React.FC<CanvasProps> = ({ 
  selectedServerId, 
  addedParts, 
  onAddPart, 
  onRemovePart,
  serverData
}) => {
  const [dragOver, setDragOver] = useState<PartType | null>(null);
  
  // 드래그 오버 핸들러
  const handleDragOver = (e: React.DragEvent, type: PartType) => {
    e.preventDefault();
    // 드래그 타입 확인
    const dragType = e.dataTransfer.getData('type');
    
    // 타입이 일치하는 경우에만 드래그 오버 상태 설정
    if (dragType === type || dragType === '') {
      setDragOver(type);
    }
  };
  
  // 드래그 리브 핸들러
  const handleDragLeave = () => {
    setDragOver(null);
  };
  
  // 드롭 핸들러
  const handleDrop = (e: React.DragEvent, type: PartType) => {
    e.preventDefault();
    setDragOver(null);
    
    // 드래그 타입 확인
    const dragType = e.dataTransfer.getData('type');
    
    // 타입이 일치하는 경우에만 부품 추가
    if (dragType === type || dragType === '') {
      onAddPart(type);
    } else {
      // 타입이 일치하지 않는 경우 알림
      alert(`${dragType === ItemTypes.CPU ? 'CPU' : dragType === ItemTypes.GPU ? 'GPU' : '메모리'}는 ${type === 'cpu' ? 'CPU' : type === 'gpu' ? 'GPU' : '메모리'} 영역에 추가할 수 없습니다.`);
    }
  };

  // 서버가 선택되지 않은 경우
  if (!selectedServerId) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">서버를 선택해주세요</h3>
        <p className="text-gray-500">
          왼쪽 패널에서 서버를 선택하면 구성을 시작할 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 서버 정보 헤더 */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold">{serverData.server.name}</h2>
            <p className="text-sm text-gray-500">{serverData.server.formFactor} | {serverData.server.maxCpuSockets}소켓 | 최대 {serverData.server.maxMemorySlots} DIMM</p>
          </div>
        </div>
      </div>
      
      {/* 캔버스 영역 */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU 영역 */}
        <div 
          className={`bg-white p-4 rounded-lg shadow-md flex flex-col ${
            dragOver === 'cpu' ? 'ring-2 ring-blue-500' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, 'cpu')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'cpu')}
        >
          <h3 className="text-lg font-medium mb-2 flex justify-between items-center">
            <span>CPU</span>
            <span className="text-sm text-gray-500">{addedParts.cpu}/{serverData.constraints.maxCpu}</span>
          </h3>
          
          <div className="flex-grow flex flex-col items-center justify-center">
            {addedParts.cpu > 0 ? (
              <div className="w-full space-y-3">
                {Array.from({ length: addedParts.cpu }).map((_, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Intel Xeon Platinum 8593Q</div>
                        <div className="text-xs text-gray-500">64코어 | 2.2 GHz | 385W</div>
                      </div>
                    </div>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onRemovePart('cpu')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <p className="text-gray-500 text-sm">CPU를 드래그하여 추가하세요</p>
              </div>
            )}
          </div>
        </div>
        
        {/* GPU 영역 */}
        <div 
          className={`bg-white p-4 rounded-lg shadow-md flex flex-col ${
            dragOver === 'gpu' ? 'ring-2 ring-green-500' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, 'gpu')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'gpu')}
        >
          <h3 className="text-lg font-medium mb-2 flex justify-between items-center">
            <span>GPU</span>
            <span className="text-sm text-gray-500">{addedParts.gpu}/{serverData.constraints.maxGpu}</span>
          </h3>
          
          <div className="flex-grow flex flex-col items-center justify-center">
            {addedParts.gpu > 0 ? (
              <div className="w-full space-y-3">
                {Array.from({ length: addedParts.gpu }).map((_, index) => (
                  <div key={index} className="bg-green-50 p-3 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-sm">NVIDIA A100 PCIe</div>
                        <div className="text-xs text-gray-500">40GB HBM2 | 250W</div>
                      </div>
                    </div>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onRemovePart('gpu')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <p className="text-gray-500 text-sm">GPU를 드래그하여 추가하세요</p>
              </div>
            )}
          </div>
        </div>
        
        {/* 메모리 영역 */}
        <div 
          className={`bg-white p-4 rounded-lg shadow-md flex flex-col ${
            dragOver === 'memory' ? 'ring-2 ring-purple-500' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, 'memory')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'memory')}
        >
          <h3 className="text-lg font-medium mb-2 flex justify-between items-center">
            <span>메모리</span>
            <span className="text-sm text-gray-500">
              {addedParts.memory}/{addedParts.cpu > 0 ? 
                addedParts.cpu * serverData.constraints.memoryPerProcessor : 
                serverData.constraints.memoryPerProcessor}
            </span>
          </h3>
          
          <div className="flex-grow flex flex-col items-center justify-center">
            {addedParts.memory > 0 ? (
              <div className="w-full space-y-3">
                {Array.from({ length: addedParts.memory }).map((_, index) => (
                  <div key={index} className="bg-purple-50 p-3 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-sm">HPE DDR5-5600 128GB</div>
                        <div className="text-xs text-gray-500">DDR5 | 5600 MT/s</div>
                      </div>
                    </div>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onRemovePart('memory')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-sm">메모리를 드래그하여 추가하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 도움말 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        <p>부품을 추가하려면 왼쪽 패널에서 드래그하여 해당 영역에 놓으세요. 각 부품은 해당 영역에만 추가할 수 있습니다. 제거하려면 부품의 삭제 버튼을 클릭하세요.</p>
      </div>
    </div>
  );
};

export default Canvas;

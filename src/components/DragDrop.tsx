import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

// 드래그 아이템 타입 정의
export const ItemTypes = {
  SERVER: 'server',
  CPU: 'cpu',
  GPU: 'gpu',
  MEMORY: 'memory'
};

// 드래그 가능한 부품 컴포넌트
interface DraggablePartProps {
  type: string;
  item: {
    id: number;
    name: string;
    manufacturer: string;
    compatible: boolean;
  };
  isDisabled?: boolean;
}

export const DraggablePart: React.FC<DraggablePartProps> = ({ type, item, isDisabled = false }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { ...item, type },
    canDrag: !isDisabled,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      className={`border rounded-md p-3 mb-2 ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'
      } ${isDragging ? 'opacity-50' : ''} ${
        type === 'cpu' ? 'bg-blue-50' : 
        type === 'gpu' ? 'bg-green-50' : 
        type === 'memory' ? 'bg-purple-50' : 'bg-gray-50'
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center ${
          type === 'cpu' ? 'bg-blue-100 text-blue-700' : 
          type === 'gpu' ? 'bg-green-100 text-green-700' : 
          type === 'memory' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'
        }`}>
          {type === 'cpu' ? 'C' : type === 'gpu' ? 'G' : 'M'}
        </div>
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-gray-500">{item.manufacturer}</div>
        </div>
      </div>
    </div>
  );
};

// 드롭 영역 컴포넌트
interface DropZoneProps {
  type: string;
  onDrop: (item: any) => void;
  children: React.ReactNode;
  isActive?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ type, onDrop, children, isActive = true }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: type,
    drop: (item) => onDrop(item),
    canDrop: () => isActive,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  }));

  const isActive_Over = isOver && canDrop;
  
  return (
    <div
      ref={drop}
      className={`border-2 ${
        isActive_Over ? 'border-blue-500 bg-blue-50' : 
        !isActive ? 'border-gray-300 bg-gray-100' : 'border-dashed border-gray-300'
      } rounded-lg p-4 transition-colors`}
    >
      {children}
    </div>
  );
};

// 부품 라이브러리 컴포넌트 (드래그 가능한 부품 목록)
interface DraggablePartLibraryProps {
  selectedServerId: number | null;
  onSelectServer: (serverId: number) => void;
}

export const DraggablePartLibrary: React.FC<DraggablePartLibraryProps> = ({ selectedServerId, onSelectServer }) => {
  // 샘플 서버 데이터
  const sampleServers = [
    { id: 1, name: '서버 모델 A', manufacturer: 'XXX', type: '랙마운트' },
    { id: 2, name: '서버 모델 B', manufacturer: 'YYY', type: '타워' },
    { id: 3, name: '서버 모델 C', manufacturer: 'ZZZ', type: '블레이드' },
  ];

  // 샘플 부품 데이터
  const sampleParts = {
    cpu: [
      { id: 1, name: 'CPU 모델1', manufacturer: '삼성', compatible: true },
      { id: 2, name: 'CPU 모델2', manufacturer: '하이닉스', compatible: true },
    ],
    gpu: [
      { id: 1, name: 'GPU H100', manufacturer: 'NVIDIA', compatible: true },
      { id: 2, name: 'GPU H2', manufacturer: 'NVIDIA', compatible: true },
      { id: 3, name: 'GPU 모델Z', manufacturer: '기타', compatible: false },
    ],
    memory: [
      { id: 1, name: '메모리 32GB', manufacturer: '삼성 C', compatible: true },
      { id: 2, name: '메모리 64GB', manufacturer: '하이닉스 D', compatible: true },
    ]
  };

  const [activeTab, setActiveTab] = React.useState('server');

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">부품 라이브러리</h2>
      
      {/* 카테고리 탭 */}
      <div className="flex border-b mb-4">
        <button 
          className={`px-4 py-2 ${activeTab === 'server' ? 'border-b-2 border-blue-500 font-medium text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('server')}
        >
          서버
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'cpu' ? 'border-b-2 border-blue-500 font-medium text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('cpu')}
          disabled={!selectedServerId}
        >
          CPU
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'gpu' ? 'border-b-2 border-blue-500 font-medium text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('gpu')}
          disabled={!selectedServerId}
        >
          GPU
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'memory' ? 'border-b-2 border-blue-500 font-medium text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('memory')}
          disabled={!selectedServerId}
        >
          메모리
        </button>
      </div>
      
      {/* 검색 필터 */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="검색..."
            className="w-full p-2 border rounded-md pl-8"
          />
          <svg
            className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
      
      {/* 서버 목록 */}
      {activeTab === 'server' && (
        <div className="grid grid-cols-1 gap-4">
          {sampleServers.map((server) => (
            <div
              key={server.id}
              className={`border rounded-md p-4 hover:shadow-lg transition cursor-pointer ${selectedServerId === server.id ? 'border-blue-500 bg-blue-50' : ''}`}
              onClick={() => onSelectServer(server.id)}
            >
              <div className="bg-gray-200 h-24 mb-2 rounded flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6" y2="6"></line>
                  <line x1="6" y1="18" x2="6" y2="18"></line>
                </svg>
              </div>
              <h3 className="font-medium">{server.name}</h3>
              <div className="text-sm text-gray-500">
                <p>제조사: {server.manufacturer}</p>
                <p>유형: {server.type}</p>
              </div>
              <button className="mt-2 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition">
                선택하기
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CPU 목록 */}
      {activeTab === 'cpu' && selectedServerId && (
        <div>
          <h3 className="font-medium mb-2">CPU 목록</h3>
          {sampleParts.cpu.map((cpu) => (
            <DraggablePart 
              key={cpu.id} 
              type={ItemTypes.CPU} 
              item={cpu} 
              isDisabled={!cpu.compatible}
            />
          ))}
        </div>
      )}

      {/* GPU 목록 */}
      {activeTab === 'gpu' && selectedServerId && (
        <div>
          <h3 className="font-medium mb-2">GPU 목록</h3>
          {sampleParts.gpu.map((gpu) => (
            <DraggablePart 
              key={gpu.id} 
              type={ItemTypes.GPU} 
              item={gpu} 
              isDisabled={!gpu.compatible}
            />
          ))}
        </div>
      )}

      {/* 메모리 목록 */}
      {activeTab === 'memory' && selectedServerId && (
        <div>
          <h3 className="font-medium mb-2">메모리 목록</h3>
          {sampleParts.memory.map((memory) => (
            <DraggablePart 
              key={memory.id} 
              type={ItemTypes.MEMORY} 
              item={memory} 
              isDisabled={!memory.compatible}
            />
          ))}
        </div>
      )}
    </div>
  );
};

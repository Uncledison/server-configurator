import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import serverData from './data/serverData';
import PartLibrary from './components/PartLibrary';
import Canvas from './components/Canvas';
import InfoPanel from './components/InfoPanel';
import exportToPDF from './components/ExportPDF';
import { ServerDataType, PartType, AddedPartsType } from './types';
import './App.css';

function App() {
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [addedParts, setAddedParts] = useState<AddedPartsType>({
    cpu: 0,
    gpu: 0,
    memory: 0
  });
  const [activeTab, setActiveTab] = useState<'server' | 'cpu' | 'gpu' | 'memory'>('server');

  // 부품 추가 함수
  const addPart = (type: PartType): boolean => {
    if (selectedServerId === null) {
      alert('서버를 먼저 선택해주세요.');
      return false;
    }

    const server = serverData.server;
    
    // 부품 타입별 제한 검사
    if (type === 'cpu' && addedParts.cpu >= server.maxCpuSockets) {
      alert(`CPU는 최대 ${server.maxCpuSockets}개까지 추가할 수 있습니다.`);
      return false;
    }
    
    if (type === 'gpu' && addedParts.gpu >= serverData.constraints.maxGpu) {
      alert(`GPU는 최대 ${serverData.constraints.maxGpu}개까지 추가할 수 있습니다.`);
      return false;
    }
    
    if (type === 'memory' && addedParts.memory >= server.maxMemorySlots) {
      alert(`메모리는 최대 ${server.maxMemorySlots}개까지 추가할 수 있습니다.`);
      return false;
    }

    setAddedParts(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    
    return true;
  };

  // 부품 제거 함수
  const removePart = (type: PartType): boolean => {
    if (addedParts[type] > 0) {
      setAddedParts(prev => ({
        ...prev,
        [type]: prev[type] - 1
      }));
      return true;
    }
    return false;
  };

  // 서버 선택 함수
  const selectServer = (id: number): void => {
    setSelectedServerId(id);
    // 서버 변경 시 부품 초기화
    setAddedParts({
      cpu: 0,
      gpu: 0,
      memory: 0
    });
  };

  // PDF 내보내기 함수
  const handleExportPDF = async (): Promise<void> => {
    try {
      // 클라이언트 측에서 PDF 생성 (서버 사이드 PDF 생성 API가 없는 경우)
      const result = await exportToPDF({
        selectedServerId,
        addedParts,
        serverData: serverData as ServerDataType
      });
      
      if (result) {
        console.log('PDF 내보내기 성공');
      }
    } catch (error) {
      console.error('PDF 내보내기 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <header className="header">
          <div className="logo">
            <span className="icon">💻</span> 서버 구성 시스템
          </div>
          {/* 상단 버튼 삭제 - 사용자 요청에 따라 제거 */}
        </header>
        
        <main className="main-content">
          <h1>서버 구성 시스템</h1>
          
          <div className="action-buttons">
            <button className="action-button" disabled>저장</button>
            <button className="action-button" disabled>불러오기</button>
            <button className="action-button" onClick={handleExportPDF}>내보내기</button>
          </div>
          
          <div className="workspace">
            <div className="left-panel">
              <h2>부품 라이브러리</h2>
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'server' ? 'active' : ''}`}
                  onClick={() => setActiveTab('server')}
                >
                  서버
                </button>
                <button 
                  className={`tab ${activeTab === 'cpu' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cpu')}
                >
                  CPU
                </button>
                <button 
                  className={`tab ${activeTab === 'gpu' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gpu')}
                >
                  GPU
                </button>
                <button 
                  className={`tab ${activeTab === 'memory' ? 'active' : ''}`}
                  onClick={() => setActiveTab('memory')}
                >
                  메모리
                </button>
              </div>
              
              <PartLibrary 
                serverData={serverData as ServerDataType} 
                onSelectServer={selectServer}
                selectedServerId={selectedServerId}
              />
            </div>
            
            <div className="center-panel">
              <Canvas 
                selectedServerId={selectedServerId}
                serverData={serverData as ServerDataType}
                addedParts={addedParts}
                onAddPart={addPart}
                onRemovePart={removePart}
              />
            </div>
            
            <div className="right-panel">
              <InfoPanel 
                selectedServerId={selectedServerId}
                serverData={serverData as ServerDataType}
                addedParts={addedParts}
              />
            </div>
          </div>
        </main>
        
        <footer className="footer">
          서버 구성 시스템 데모 - 2025
        </footer>
      </div>
    </DndProvider>
  );
}

export default App;

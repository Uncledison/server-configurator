interface ExportPDFProps {
  selectedServerId: number | null;
  addedParts: {
    cpu: number;
    gpu: number;
    memory: number;
  };
  serverData: any;
}

// PDF 내보내기 함수 - 클라이언트 측 구현
const exportToPDF = async ({ selectedServerId, addedParts, serverData }: ExportPDFProps) => {
  if (!selectedServerId) {
    alert('서버를 먼저 선택해주세요.');
    return false;
  }

  try {
    // PDF 생성 시작 알림
    alert('PDF 생성을 시작합니다. 잠시만 기다려주세요...');

    // 서버 정보
    const server = serverData.server;
    
    // 선택된 부품 정보
    const selectedCpu = serverData.compatibleParts.cpu[0];
    const selectedGpu = serverData.compatibleParts.gpu[0];
    const selectedMemory = serverData.compatibleParts.memory[2];
    
    // 현재 사용 중인 리소스 계산
    const cpuCount = addedParts.cpu;
    const gpuCount = addedParts.gpu;
    const memoryCount = addedParts.memory;
    
    const powerUsage = cpuCount * selectedCpu.power + gpuCount * selectedGpu.power + memoryCount * 10;
    const memoryUsage = memoryCount * selectedMemory.capacity;
    
    // 예상 비용 계산
    const cpuPrice = 15000000;  // 1,500만원
    const gpuPrice = 30000000;  // 3,000만원
    const memoryPrice = 2000000;  // 200만원
    
    const estimatedCost = cpuCount * cpuPrice + gpuCount * gpuPrice + memoryCount * memoryPrice;
    
    // 현재 날짜
    const today = new Date();
    const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

    // jsPDF 동적 로드 (필요시에만 로드하여 초기 로딩 시간 단축)
    const { jsPDF } = await import('jspdf');
    
    // PDF 생성
    const doc = new jsPDF();
    
    // 한글 폰트 지원 설정
    doc.setFont('helvetica');
    
    // 제목
    doc.setFontSize(22);
    doc.text('서버 구성 명세서', 105, 20, { align: 'center' });
    
    // 날짜
    doc.setFontSize(10);
    doc.text(`생성일: ${dateStr}`, 105, 30, { align: 'center' });
    
    // 구분선
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // 서버 정보
    doc.setFontSize(16);
    doc.text('서버 정보', 20, 45);
    
    doc.setFontSize(12);
    doc.text(`서버 모델: ${server.name}`, 25, 55);
    doc.text(`제조사: ${server.manufacturer}`, 25, 62);
    doc.text(`폼팩터: ${server.formFactor}`, 25, 69);
    doc.text(`최대 CPU 소켓: ${server.maxCpuSockets}개`, 25, 76);
    doc.text(`최대 메모리 슬롯: ${server.maxMemorySlots}개`, 25, 83);
    
    // 구성 요약
    doc.setFontSize(16);
    doc.text('구성 요약', 20, 95);
    
    doc.setFontSize(12);
    doc.text(`CPU: ${cpuCount > 0 ? `${selectedCpu.name} x${cpuCount}` : '없음'}`, 25, 105);
    doc.text(`GPU: ${gpuCount > 0 ? `${selectedGpu.name} x${gpuCount}` : '없음'}`, 25, 112);
    doc.text(`메모리: ${memoryCount > 0 ? `${selectedMemory.name} x${memoryCount}` : '없음'}`, 25, 119);
    
    // 리소스 사용량
    doc.setFontSize(16);
    doc.text('리소스 사용량', 20, 131);
    
    doc.setFontSize(12);
    doc.text(`전력 사용량: ${powerUsage}W / ${server.maxPower}W`, 25, 141);
    
    // 전력 사용량 바
    const powerPercentage = Math.min(powerUsage / server.maxPower, 1) * 100;
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(52, 152, 219);
    doc.roundedRect(25, 145, 150, 8, 2, 2, 'S');
    doc.roundedRect(25, 145, 150 * (powerPercentage / 100), 8, 2, 2, 'F');
    
    doc.text(`메모리 용량: ${memoryUsage}GB / ${server.maxMemorySlots * 128}GB`, 25, 160);
    
    // 메모리 사용량 바
    const memoryPercentage = Math.min(memoryUsage / (server.maxMemorySlots * 128), 1) * 100;
    doc.roundedRect(25, 164, 150, 8, 2, 2, 'S');
    doc.roundedRect(25, 164, 150 * (memoryPercentage / 100), 8, 2, 2, 'F');
    
    // 예상 비용
    doc.setFontSize(16);
    doc.text('예상 비용', 20, 180);
    
    doc.setFontSize(18);
    doc.text(`₩${estimatedCost.toLocaleString()}`, 105, 190, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`CPU: ₩${(cpuCount * cpuPrice).toLocaleString()} | GPU: ₩${(gpuCount * gpuPrice).toLocaleString()} | 메모리: ₩${(memoryCount * memoryPrice).toLocaleString()}`, 105, 198, { align: 'center' });
    
    // 부품 상세 정보
    if (cpuCount > 0 || gpuCount > 0 || memoryCount > 0) {
      doc.setFontSize(16);
      doc.text('부품 상세 정보', 20, 210);
      
      let yPos = 220;
      
      if (cpuCount > 0) {
        doc.setFontSize(12);
        doc.text(`CPU: ${selectedCpu.name}`, 25, yPos);
        yPos += 7;
        
        doc.setFontSize(10);
        doc.text(`코어: ${selectedCpu.cores}코어`, 30, yPos);
        yPos += 5;
        doc.text(`주파수: ${selectedCpu.frequency}`, 30, yPos);
        yPos += 5;
        doc.text(`캐시: ${selectedCpu.cache}`, 30, yPos);
        yPos += 5;
        doc.text(`TDP: ${selectedCpu.power}W`, 30, yPos);
        yPos += 10;
      }
      
      if (gpuCount > 0) {
        doc.setFontSize(12);
        doc.text(`GPU: ${selectedGpu.name}`, 25, yPos);
        yPos += 7;
        
        doc.setFontSize(10);
        doc.text(`메모리: ${selectedGpu.memory}`, 30, yPos);
        yPos += 5;
        doc.text(`TDP: ${selectedGpu.power}W`, 30, yPos);
        yPos += 10;
      }
      
      if (memoryCount > 0) {
        doc.setFontSize(12);
        doc.text(`메모리: ${selectedMemory.name}`, 25, yPos);
        yPos += 7;
        
        doc.setFontSize(10);
        doc.text(`유형: ${selectedMemory.type}`, 30, yPos);
        yPos += 5;
        doc.text(`속도: ${selectedMemory.speed}`, 30, yPos);
        yPos += 5;
        doc.text(`용량: ${selectedMemory.capacity}GB x ${memoryCount} = ${selectedMemory.capacity * memoryCount}GB`, 30, yPos);
      }
    }
    
    // 푸터
    doc.setFontSize(8);
    doc.text('이 문서는 서버 구성 시스템에서 자동 생성되었습니다.', 105, 285, { align: 'center' });
    
    // PDF 저장
    doc.save('서버_구성_명세서.pdf');
    
    return true;
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error);
    alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
    return false;
  }
};

export default exportToPDF;

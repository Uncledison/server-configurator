import sys
import json
import weasyprint
from datetime import datetime

def generate_pdf(data_path, output_path):
    # 데이터 파일 읽기
    with open(data_path, 'r') as f:
        data = json.load(f)
    
    # 데이터 추출
    selected_server_id = data.get('selectedServerId')
    added_parts = data.get('addedParts', {})
    server_data = data.get('serverData', {})
    
    # 서버 정보
    server_info = server_data.get('server', {})
    
    # 선택된 부품 정보
    selected_cpu = server_data.get('compatibleParts', {}).get('cpu', [{}])[0]
    selected_gpu = server_data.get('compatibleParts', {}).get('gpu', [{}])[0]
    selected_memory = server_data.get('compatibleParts', {}).get('memory', [{}])[2]
    
    # 현재 사용 중인 리소스 계산
    cpu_count = added_parts.get('cpu', 0)
    gpu_count = added_parts.get('gpu', 0)
    memory_count = added_parts.get('memory', 0)
    
    power_usage = cpu_count * selected_cpu.get('power', 0) + gpu_count * selected_gpu.get('power', 0) + memory_count * 10
    memory_usage = memory_count * selected_memory.get('capacity', 0)
    
    # 예상 비용 계산
    cpu_price = 15000000  # 1,500만원
    gpu_price = 30000000  # 3,000만원
    memory_price = 2000000  # 200만원
    
    estimated_cost = cpu_count * cpu_price + gpu_count * gpu_price + memory_count * memory_price
    
    # 날짜 포맷
    today = datetime.now()
    date_str = f"{today.year}년 {today.month}월 {today.day}일"
    
    # HTML 템플릿 생성
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>서버 구성 명세서</title>
        <style>
            @font-face {{
                font-family: 'Noto Sans CJK KR';
                src: url('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc');
            }}
            body {{
                font-family: 'Noto Sans CJK KR', sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
            }}
            .header {{
                text-align: center;
                margin-bottom: 20px;
            }}
            .title {{
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }}
            .date {{
                font-size: 12px;
                color: #666;
                margin-bottom: 15px;
            }}
            .divider {{
                border-top: 1px solid #ddd;
                margin: 15px 0;
            }}
            .section {{
                margin-bottom: 20px;
            }}
            .section-title {{
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #2c3e50;
            }}
            .info-item {{
                margin-left: 15px;
                margin-bottom: 5px;
                font-size: 13px;
            }}
            .part-item {{
                margin-left: 15px;
                margin-bottom: 8px;
                font-size: 13px;
            }}
            .part-detail {{
                margin-left: 25px;
                font-size: 12px;
                color: #555;
            }}
            .resource-bar {{
                background-color: #eee;
                height: 15px;
                width: 100%;
                border-radius: 10px;
                margin-top: 5px;
                margin-bottom: 10px;
            }}
            .resource-fill {{
                background-color: #3498db;
                height: 15px;
                border-radius: 10px;
            }}
            .cost {{
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                margin: 10px 0;
            }}
            .cost-detail {{
                font-size: 12px;
                color: #666;
                text-align: center;
            }}
            .footer {{
                font-size: 10px;
                color: #999;
                text-align: center;
                margin-top: 30px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <div class="title">서버 구성 명세서</div>
            <div class="date">생성일: {date_str}</div>
        </div>
        
        <div class="divider"></div>
        
        <div class="section">
            <div class="section-title">서버 정보</div>
            <div class="info-item">서버 모델: {server_info.get('name', '')}</div>
            <div class="info-item">제조사: {server_info.get('manufacturer', '')}</div>
            <div class="info-item">폼팩터: {server_info.get('formFactor', '')}</div>
            <div class="info-item">최대 CPU 소켓: {server_info.get('maxCpuSockets', '')}개</div>
            <div class="info-item">최대 메모리 슬롯: {server_info.get('maxMemorySlots', '')}개</div>
        </div>
        
        <div class="section">
            <div class="section-title">구성 요약</div>
            <div class="info-item">CPU: {f"{selected_cpu.get('name', '')} x{cpu_count}" if cpu_count > 0 else "없음"}</div>
            <div class="info-item">GPU: {f"{selected_gpu.get('name', '')} x{gpu_count}" if gpu_count > 0 else "없음"}</div>
            <div class="info-item">메모리: {f"{selected_memory.get('name', '')} x{memory_count}" if memory_count > 0 else "없음"}</div>
        </div>
        
        <div class="section">
            <div class="section-title">리소스 사용량</div>
            <div class="info-item">전력 사용량: {power_usage}W / {server_info.get('maxPower', '')}W</div>
            <div class="resource-bar">
                <div class="resource-fill" style="width: {min(power_usage / server_info.get('maxPower', 1) * 100, 100)}%;"></div>
            </div>
            
            <div class="info-item">메모리 용량: {memory_usage}GB / {server_info.get('maxMemorySlots', 0) * 128}GB</div>
            <div class="resource-bar">
                <div class="resource-fill" style="width: {min(memory_usage / (server_info.get('maxMemorySlots', 1) * 128) * 100, 100)}%;"></div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">예상 비용</div>
            <div class="cost">₩{format(estimated_cost, ',d')}</div>
            <div class="cost-detail">
                CPU: ₩{format(cpu_count * cpu_price, ',d')} | 
                GPU: ₩{format(gpu_count * gpu_price, ',d')} | 
                메모리: ₩{format(memory_count * memory_price, ',d')}
            </div>
        </div>
    """
    
    # 부품 상세 정보 섹션 추가
    if cpu_count > 0 or gpu_count > 0 or memory_count > 0:
        html += """
        <div class="section">
            <div class="section-title">부품 상세 정보</div>
        """
        
        if cpu_count > 0:
            html += f"""
            <div class="part-item">CPU: {selected_cpu.get('name', '')}</div>
            <div class="part-detail">코어: {selected_cpu.get('cores', '')}코어</div>
            <div class="part-detail">주파수: {selected_cpu.get('frequency', '')}</div>
            <div class="part-detail">캐시: {selected_cpu.get('cache', '')}</div>
            <div class="part-detail">TDP: {selected_cpu.get('power', '')}W</div>
            """
        
        if gpu_count > 0:
            html += f"""
            <div class="part-item">GPU: {selected_gpu.get('name', '')}</div>
            <div class="part-detail">메모리: {selected_gpu.get('memory', '')}</div>
            <div class="part-detail">TDP: {selected_gpu.get('power', '')}W</div>
            """
        
        if memory_count > 0:
            html += f"""
            <div class="part-item">메모리: {selected_memory.get('name', '')}</div>
            <div class="part-detail">유형: {selected_memory.get('type', '')}</div>
            <div class="part-detail">속도: {selected_memory.get('speed', '')}</div>
            <div class="part-detail">용량: {selected_memory.get('capacity', '')}GB x {memory_count} = {selected_memory.get('capacity', 0) * memory_count}GB</div>
            """
        
        html += """
        </div>
        """
    
    # 푸터 추가
    html += """
        <div class="footer">
            이 문서는 서버 구성 시스템에서 자동 생성되었습니다.
        </div>
    </body>
    </html>
    """
    
    # WeasyPrint로 PDF 생성
    weasyprint.HTML(string=html).write_pdf(
        output_path,
        stylesheets=[
            weasyprint.CSS(string='''
                @font-face {
                    font-family: 'Noto Sans CJK KR';
                    src: url('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc');
                }
                body {
                    font-family: 'Noto Sans CJK KR', sans-serif;
                }
            ''')
        ]
    )
    
    print(f"PDF가 성공적으로 생성되었습니다: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("사용법: python pdf_generator.py <데이터_파일_경로> <출력_PDF_경로>")
        sys.exit(1)
    
    data_path = sys.argv[1]
    output_path = sys.argv[2]
    
    generate_pdf(data_path, output_path)

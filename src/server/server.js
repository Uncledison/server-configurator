import express from 'express';
import { exec } from 'child_process';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../../dist')));

// JSON 파싱 미들웨어
app.use(bodyParser.json());

// PDF 내보내기 API 엔드포인트
app.post('/api/export-pdf', (req, res) => {
  const data = req.body;
  
  // 임시 데이터 파일 생성
  const tempDataPath = path.join(__dirname, 'temp_data.json');
  fs.writeFileSync(tempDataPath, JSON.stringify(data));
  
  // Python 스크립트 실행
  const pythonScript = path.join(__dirname, 'pdf_generator.py');
  const outputPath = path.join(__dirname, 'output.pdf');
  
  exec(`python3 ${pythonScript} ${tempDataPath} ${outputPath}`, (error, stdout, stderr) => {
    // 임시 데이터 파일 삭제
    fs.unlinkSync(tempDataPath);
    
    if (error) {
      console.error(`실행 오류: ${error}`);
      return res.status(500).send('PDF 생성 중 오류가 발생했습니다.');
    }
    
    // PDF 파일 전송
    res.download(outputPath, '서버_구성_명세서.pdf', (err) => {
      if (err) {
        console.error(`다운로드 오류: ${err}`);
      }
      
      // 다운로드 후 임시 PDF 파일 삭제
      fs.unlinkSync(outputPath);
    });
  });
});

// 모든 경로에 대해 index.html 제공 (SPA 라우팅 지원)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`서버가 http://0.0.0.0:${PORT} 에서 실행 중입니다.`);
});

const serverData = {
  "server": {
    "name": "HPE ProLiant DL380 Gen11",
    "manufacturer": "HPE",
    "formFactor": "2U 랙",
    "description": "다양한 워크로드와 환경에 적응 가능한 안전한 2P 2U HPE ProLiant DL380 Gen11 서버는 확장성과 확장성의 적절한 균형으로 세계적 수준의 성능을 제공합니다.",
    "chassisTypes": [
      "8SFF (SAS/SATA/NVMe)",
      "12LFF",
      "12EDSFF"
    ],
    "maxCpuSockets": 2,
    "maxMemorySlots": 32,
    "maxPciSlots": 6,
    "maxPower": 2200
  },
  "compatibleParts": {
    "cpu": [
      {
        "id": 1,
        "name": "Intel Xeon Platinum 8593Q",
        "manufacturer": "Intel",
        "series": "Platinum",
        "frequency": "2.2 GHz",
        "cores": 64,
        "cache": "320 MB L3",
        "power": 385,
        "compatible": true
      },
      {
        "id": 2,
        "name": "Intel Xeon Platinum 8592+",
        "manufacturer": "Intel",
        "series": "Platinum",
        "frequency": "1.9 GHz",
        "cores": 64,
        "cache": "320 MB L3",
        "power": 350,
        "compatible": true
      },
      {
        "id": 3,
        "name": "Intel Xeon Gold 6558Q",
        "manufacturer": "Intel",
        "series": "Gold",
        "frequency": "3.2 GHz",
        "cores": 32,
        "cache": "60.0 MB L3",
        "power": 350,
        "compatible": true
      },
      {
        "id": 4,
        "name": "Intel Xeon Silver 4516+",
        "manufacturer": "Intel",
        "series": "Silver",
        "frequency": "2.2 GHz",
        "cores": 24,
        "cache": "45.0 MB L3",
        "power": 185,
        "compatible": true
      },
      {
        "id": 5,
        "name": "Intel Xeon Bronze 3508U",
        "manufacturer": "Intel",
        "series": "Bronze",
        "frequency": "2.1 GHz",
        "cores": 8,
        "cache": "22.5 MB L3",
        "power": 125,
        "compatible": true,
        "notes": "단일 소켓만 지원"
      }
    ],
    "memory": [
      {
        "id": 1,
        "name": "HPE DDR5-4800 32GB",
        "manufacturer": "HPE",
        "type": "DDR5",
        "speed": "4800 MT/s",
        "capacity": 32,
        "compatible": true
      },
      {
        "id": 2,
        "name": "HPE DDR5-5200 64GB",
        "manufacturer": "HPE",
        "type": "DDR5",
        "speed": "5200 MT/s",
        "capacity": 64,
        "compatible": true
      },
      {
        "id": 3,
        "name": "HPE DDR5-5600 128GB",
        "manufacturer": "HPE",
        "type": "DDR5",
        "speed": "5600 MT/s",
        "capacity": 128,
        "compatible": true
      }
    ],
    "gpu": [
      {
        "id": 1,
        "name": "NVIDIA A100 PCIe",
        "manufacturer": "NVIDIA",
        "memory": "40GB HBM2",
        "power": 250,
        "compatible": true
      },
      {
        "id": 2,
        "name": "NVIDIA A40",
        "manufacturer": "NVIDIA",
        "memory": "48GB GDDR6",
        "power": 300,
        "compatible": true
      },
      {
        "id": 3,
        "name": "NVIDIA L40",
        "manufacturer": "NVIDIA",
        "memory": "48GB GDDR6",
        "power": 300,
        "compatible": true
      }
    ]
  },
  "constraints": {
    "maxCpu": 2,
    "maxMemoryModules": 32,
    "maxGpu": 3,
    "memoryPerProcessor": 16,
    "requiresSecondProcessorFor": {
      "secondaryRiser": true,
      "slots": [4, 5, 6]
    },
    "powerSupplyOptions": [
      {
        "name": "HPE 800W Flex Slot Platinum",
        "watts": 800
      },
      {
        "name": "HPE 1000W Flex Slot Titanium",
        "watts": 1000
      },
      {
        "name": "HPE 1600W Flex Slot Platinum",
        "watts": 1600
      },
      {
        "name": "HPE 1800W-2200W Flex Slot Titanium",
        "watts": 2200
      }
    ]
  }
};

export default serverData;

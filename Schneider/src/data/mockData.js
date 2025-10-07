// Mock data for factory floor PCs
export const factoryFloorData = {
  floorDimensions: {
    width: 300,
    height: 600
  },
  productionLines: [
    // Finishing Lines (vertical, top)
    {
      id: 'finishing-line-1',
      name: 'Finishing line 1',
      x: 20,
      y: 20,
      width: 60,
      height: 140
    },
    {
      id: 'finishing-line-2',
      name: 'Finishing line 2',
      x: 100,
      y: 20,
      width: 60,
      height: 140
    },
    // Assembly Lines (horizontal, below finishing lines)
    {
      id: 'assembly-line-1',
      name: 'Assembly Line 1',
      x: 20,
      y: 180,
      width: 140,
      height: 40
    },
    {
      id: 'assembly-line-2',
      name: 'Assembly Line 2',
      x: 20,
      y: 230,
      width: 140,
      height: 40
    },
    {
      id: 'assembly-line-3',
      name: 'Assembly Line 3',
      x: 20,
      y: 280,
      width: 140,
      height: 40
    },
    // Welding Line (large square at the bottom)
    {
      id: 'welding-line',
      name: 'WELDING LINE',
      x: 20,
      y: 340,
      width: 180,
      height: 180
    }
  ],
  pcs: [
    // Finishing Line 1 PCs
    {
      id: 'sanjai',
      name: 'line1_pc1',
      ipAddress: '192.168.10.41',
      x: 0,
      y: 0,
      cpu: 'Intel Core i5',
      ram: '8GB',
      disk: '256GB SSD',
      lastReboot: '2024-06-02T08:00:00Z', // 8 days ago from June 10, 2024
      status: 'online',
      productionLine: 'finishing-line-1'
    },
    {
      id: 'santi',
      name: 'line1_pc2',
      ipAddress: '192.168.10.42',
      x: 0,
      y: 0,
      cpu: 'Intel Core i5',
      ram: '8GB',
      disk: '256GB SSD',
      lastReboot: '2024-01-25T09:00:00Z',
      status: 'online',
      productionLine: 'finishing-line-1'
    },
    // Finishing Line 2 PCs
    {
      id: 'bhargav',
      name: 'line2_pc1',
      ipAddress: '192.168.10.51',
      x: 0,
      y: 0,
      cpu: 'Intel Core i5',
      ram: '8GB',
      disk: '256GB SSD',
      lastReboot: '2024-01-25T08:30:00Z',
      status: 'online',
      productionLine: 'finishing-line-2'
    },
    {
      id: 'prassanna',
      name: 'line2_pc2',
      ipAddress: '192.168.10.52',
      x: 0,
      y: 0,
      cpu: 'Intel Core i5',
      ram: '8GB',
      disk: '256GB SSD',
      lastReboot: '2024-01-25T09:00:00Z',
      status: 'online',
      productionLine: 'finishing-line-2'
    },
    {
      id: 'pc-demo-old',
      name: 'Demo PC - Needs Reboot',
      ipAddress: '192.168.10.99',
      x: 0,
      y: 0,
      cpu: 'Intel Core i5',
      ram: '8GB',
      disk: '256GB SSD',
      lastReboot: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'online',
      productionLine: 'finishing-line-1'
    },
    {
      id: 'pc-demo-alert',
      name: 'Demo Alert PC',
      ipAddress: '192.168.10.123',
      x: 10,
      y: 10,
      cpu: 'Intel Core i7',
      ram: '16GB',
      disk: '512GB SSD',
      lastReboot: '2024-06-01T08:00:00Z', // 9 days ago from June 10, 2024
      status: 'online',
      productionLine: 'assembly-line-1'
    }
  ]
};
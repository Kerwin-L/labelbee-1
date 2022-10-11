import img1 from './images/10.jpg';
import img2 from './images/19.jpg';
import img3 from './images/20.jpg';
import img4 from './images/66.jpg';
import { pointCloudResult1 } from './pointCloud';

// const MOCK_URL = 'http://bee-sdk-demo.sensebee.xyz/images/';
// export const fileList = ['10', '19', '20', '66'].map((i) => `${MOCK_URL}${i}.jpg`);
export const fileList = [img1, img2, img3, img4];
export const videoList = [
  'http://127.0.0.1:8080/a.mp4',
  'http://127.0.0.1:8080/d.mp4',
  'http://127.0.0.1:8080/c.mp4',
  'http://127.0.0.1:8080/e.mp4',
];

export const kitti2Url = 'http://10.152.32.20:8080/';

export const kitti2PointCloudList = [
  `${kitti2Url}lidar/6.pcd`,
  `${kitti2Url}lidar/1.pcd`,
  `${kitti2Url}lidar/3.pcd`,
  `${kitti2Url}lidar/4.pcd`,
  `${kitti2Url}lidar/8.pcd`,
];

export const kitti2PointCloudMappingImgList = [
  {
    url: `${kitti2Url}image/P2/2.png`,
    calib: {
      // 2
      P0: [
        [7.215377e2, 0.0, 6.095593e2, 0.0],
        [0.0, 7.215377e2, 1.72854e2, 0.0],
        [0.0, 0.0, 1.0, 0.0],
      ],
      P1: [
        [7.215377e2, 0.0, 6.095593e2, -3.875744e2],
        [0.0, 7.215377e2, 1.72854e2, 0.0],
        [0.0, 0.0, 1.0, 0.0],
      ],
      P: [
        [721.5377, 0, 609.5593, 44.85728],
        [0, 721.5377, 172.854, 0.2163791],
        [0, 0, 1, 0.002745884],
      ],
      R: [
        [0.9999239, 0.00983776, -0.007445048],
        [-0.009869795, 0.9999421, -0.004278459],
        [0.007402527, 0.004351614, 0.9999631],
      ],
      T: [
        [0.007533745, -0.9999714, -0.000616602, -0.004069766],
        [0.01480249, 0.0007280733, -0.9998902, -0.07631618],
        [0.9998621, 0.00752379, 0.01480755, -0.2717806],
      ],
    },
  },
  {
    url: `${kitti2Url}image/P2/1.png`,
    calib: {
      P: [
        [721.5377, 0, 609.5593, 44.85728],
        [0, 721.5377, 172.854, 0.2163791],
        [0, 0, 1, 0.002745884],
      ],
      R: [
        [0.9999239, 0.00983776, -0.007445048],
        [-0.009869795, 0.9999421, -0.004278459],
        [0.007402527, 0.004351614, 0.9999631],
      ],
      T: [
        [0.007533745, -0.9999714, -0.000616602, -0.004069766],
        [0.01480249, 0.0007280733, -0.9998902, -0.07631618],
        [0.9998621, 0.00752379, 0.01480755, -0.2717806],
      ],
    },
  },
];

export const kittiUrl = 'http://127.0.0.1:8086/';

export const kittiPointCloudList = [`${kittiUrl}lidar/1651762642488711000.pcd`];

export const kittiPointCloudMappingImgList = [
  {
    url: `${kittiUrl}/image/camera_0/1651762642488711000.jpeg`,
    calib: {
      P: [
        [7121.913, 0, 1801.1448, 0],
        [0, 7076.654, 1210.8729, 0],
        [0, 0, 1, 0],
      ],
      R: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      T: [
        [0.012516548, -0.9999209, 0.0011964142, -0.1286864],
        [-0.0020601507, -0.0012222934, -0.99999714, 1.4679885],
        [0.99991953, 0.012514047, -0.0020752868, -2.0875525],
      ],
    },
  },
];

export const speUrl = 'http://127.0.0.1:8082';
export const spePointCloudList = [
  // 'http://127.0.0.1:8082/lidar/1651762642488711000.pcd',
  'http://127.0.0.1:8082/lidar/1651762642588977000.pcd',
  'http://127.0.0.1:8082/lidar/1651762642689240000.pcd',
];

export const spePointCloudMappingImgList = [
  {
    url: `${speUrl}/image/camera_0/1651762642488711000.jpeg`,
    calib: {
      P: [
        [7121.913, 0, 1801.1448, 0],
        [0, 7076.654, 1210.8729, 0],
        [0, 0, 1, 0],
      ],
      R: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      T: [
        [0.012516548, -0.9999209, 0.0011964142, -0.1286864],
        [-0.0020601507, -0.0012222934, -0.99999714, 1.4679885],
        [0.99991953, 0.012514047, -0.0020752868, -2.0875525],
      ],
      // TI: [
      //   [0.012516547925770283, -0.0020601507276296617, 0.9999195337295532, 2.092019557952881],
      //   [-0.9999209642410278, -0.0012222934747114778, 0.01251404732465744, -0.10075818747282028],
      //   [0.0011964142322540284, -0.9999971389770508, -0.002075286814942956, 1.4638060331344605],
      // ],
      // PI: [
      //   [7347.26416015625, 0.0, 1806.3690185546876, 0],
      //   [0.0, 7304.9912109375, 1207.4578857421876, 0],
      //   [0.0, 0.0, 1.0, 0],
      // ],
    },
  },
  {
    url: `${speUrl}/image/camera_2/1651762642488711000.jpeg`,
    calib: {
      P: [
        [1310.2433, 0, 1928.9608, 0],
        [0, 1309.9546, 1039.5675, 0],
        [0, 0, 1, 0],
      ],
      R: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      T: [
        [0.012910768, -0.99988276, -0.008236689, 0.028562045],
        [0.0072789467, 0.008331138, -0.99993885, 1.4543573],
        [0.99989015, 0.012850025, 0.007385655, -2.0981874],
      ],
      // TI: [
      //   [0.012910768389701844, 0.007278946693986654, 0.999890148639679, 2.0870020389556886],
      //   [-0.999882698059082, 0.008331137709319592, 0.012850023806095124, 0.043404001742601398],
      //   [-0.008236687630414963, -0.9999387860298157, 0.007385654374957085, 1.4700000286102296],
      // ],
      // PI: [
      //   [1452.3018798828126, 0.0, 1926.398681640625, 0],
      //   [0.0, 1445.252197265625, 1057.8992919921876, 0],
      //   [0.0, 0.0, 1.0, 0],
      // ],
    },
  },
];

export const spePointCloudMappingImgList2 = [
  {
    url: `${speUrl}/image/camera_0/1651762642588977000.jpeg`,
    calib: {
      P: [
        [7121.913, 0, 1801.1448, 0],
        [0, 7076.654, 1210.8729, 0],
        [0, 0, 1, 0],
      ],
      R: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      T: [
        [0.012516548, -0.9999209, 0.0011964142, -0.1286864],
        [-0.0020601507, -0.0012222934, -0.99999714, 1.4679885],
        [0.99991953, 0.012514047, -0.0020752868, -2.0875525],
      ],
      // TI: [
      //   [0.012516547925770283, -0.0020601507276296617, 0.9999195337295532, 2.092019557952881],
      //   [-0.9999209642410278, -0.0012222934747114778, 0.01251404732465744, -0.10075818747282028],
      //   [0.0011964142322540284, -0.9999971389770508, -0.002075286814942956, 1.4638060331344605],
      // ],
      // PI: [
      //   [7347.26416015625, 0.0, 1806.3690185546876, 0],
      //   [0.0, 7304.9912109375, 1207.4578857421876, 0],
      //   [0.0, 0.0, 1.0, 0],
      // ],
    },
  },
  {
    url: `${speUrl}/image/camera_2/1651762642588977000.jpeg`,
    calib: {
      P: [
        [1310.2433, 0, 1928.9608, 0],
        [0, 1309.9546, 1039.5675, 0],
        [0, 0, 1, 0],
      ],
      R: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      T: [
        [0.012910768, -0.99988276, -0.008236689, 0.028562045],
        [0.0072789467, 0.008331138, -0.99993885, 1.4543573],
        [0.99989015, 0.012850025, 0.007385655, -2.0981874],
      ],
      // TI: [
      //   [0.012910768389701844, 0.007278946693986654, 0.999890148639679, 2.0870020389556886],
      //   [-0.999882698059082, 0.008331137709319592, 0.012850023806095124, 0.043404001742601398],
      //   [-0.008236687630414963, -0.9999387860298157, 0.007385654374957085, 1.4700000286102296],
      // ],
      // PI: [
      //   [1452.3018798828126, 0.0, 1926.398681640625, 0],
      //   [0.0, 1445.252197265625, 1057.8992919921876, 0],
      //   [0.0, 0.0, 1.0, 0],
      // ],
    },
  },
];

// export const pointCloudList = [
//   // 'http://10.53.25.142:8001/10837/1/total.pcd',
//   // 'http://127.0.0.1:8082/lidar/1651762642488711000.pcd',
//   // Sensebee data
//   // 'http://10.152.32.118:8080/000009.pcd',

//   'http://localhost:8082/input2.pcd',
//   'http://10.152.32.20:8080//top_center_lidar/2022-02-20-12-21-03-200.pcd',
//   'http://10.152.32.20:8080//top_center_lidar/2022-02-20-12-21-03-300.pcd',
//   'http://10.152.32.20:8080//top_center_lidar/2022-02-20-12-21-03-300.pcd',
//   'http://10.152.32.20:8080//top_center_lidar/2022-02-20-12-21-03-400.pcd',
//   'http://10.152.32.20:8080//top_center_lidar/2022-02-20-12-21-03-500.pcd',
//   'http://10.152.32.20:8080//top_center_lidar/2022-02-20-12-21-03-600.pcd',
//   'http://10.152.32.20:8080//top_center_lidar/2022-02-20-12-21-03-700.pcd',
//   'http://10.152.32.20:8080//top_center_lidar/2022-02-20-12-21-03-800.pcd',
//   'http://10.152.32.20:8080//top_center_lidar/2022-02-20-12-21-03-900.pcd',
// ];

const defaultUrl = 'http://localhost:8082/';
const getName = (n) => {
  if (n < 10) {
    return `00${n}`;
  }
  if (n < 100) {
    return `0${n}`;
  }
};
export const pointCloudList = Array(90)
  .fill('')
  .map((_, i) => `${defaultUrl}py/pcd-${i}/${i}.pcd`);

// export const pointCloudList = [`${defaultUrl}input-laoluo.pcd`];
const cos = Math.cos;
const sin = Math.sin;

const generateT = (data) => {
  const [x, y, z, g, r, b] = data;
  return [
    [
      cos(r) * cos(b),
      cos(r) * sin(b) * sin(g) - sin(r) * cos(g),
      cos(r) * sin(b) * cos(g) + sin(r) * sin(g),
      x,
    ],
    [
      sin(r) * cos(b),
      sin(r) * sin(b) * sin(g) - cos(r) * cos(g),
      sin(r) * sin(b) * cos(g) - cos(r) * sin(g),
      y,
    ],
    [-sin(b), cos(b) * sin(g), cos(b) * cos(g), z],
  ];
};

const commonCalib = {
  // P: [
  //   [0.344, 0.21, -0.0, 0.0],
  //   [0.028, 0.651, 0.245, 0.087],
  //   [1417.091, 1417.686, 1448.412, 591.138],
  // ],
  // P: [
  //   [0, -1417.091, 0, 1448.412],
  //   [0, 0, -1417.686, 591.138],
  //   [0, 0, 1, 0],
  // ],

  P: [
    [2065.413, 0, 2074.05, 0],
    [0, 1264.616, 348.923, 0],
    [0, 0, 0, 1],
  ],
  R: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  // T: generateT([0.555, 0.442, -0.325, 0.019, -0.068, 0.014]),
  // E: [0.555, 0.442, -0.325, 0.019, -0.068, 0.014],
  // Wide
  // T: [
  //   [0.9978225, 0.01022423, 0.06515917, -1.71446997],
  //   [-0.01187662, 0.99961633, 0.02502259, 0.10439561],
  //   [-0.06487833, -0.02574197, 0.9975611, -1.36243967],
  // ],

  // Near:
  T: [
    // [0.9978225, 0.01022423, 0.06515917, -1.71446997],
    // [-0.01187662, 0.99961633, 0.02502259, 0.10439561],
    // [-0.06487833, -0.02574197, 0.9975611, -1.36243967],

    // RIGHT LIDAR
    // [-9.99183225e-1, -4.03824036e-2, 1.46428547e-3, 3.59298643e-1],
    // [4.03597517e-2, -9.99098916e-1, -1.3131859e-2, -1.10818806],
    // [1.99326206e-3, -1.3062035e-2, 9.99912701e-1, -1.56105471],

    //
    [-9.99990632e-1, 5.99106211e-4, -4.28678459e-3, 3.91814697e-1],
    [-5.65451659e-4, -9.99969047e-1, -7.84767792e-3, 2.73607929e-2],
    [-4.29135349e-3, -7.84518043e-3, 9.99960018e-1, -1.5308623],
  ],
};

const R = {
  R: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
};

console.log('commonCalib', commonCalib);

export const pointCloudMappingImgList = [
  // {
  //   url: `${defaultUrl}img/0_25.jpg`,
  //   calib: {
  //     P: [

  //     ],
  //     T: [
  //       [0.9997993530508432, -0.020030881809693802, -0.00013195848312769939, -1.1839960935003602],
  //       [0.0200310269056973, 0.9997277867789104, 0.011962871864437815, 0.5558827995217598],
  //       [-0.00010770431013710786, -0.011963114814621027, 0.9999284335809807, -1.7072061671046799],
  //     ],
  //   },
  // },
  {
    url: `${defaultUrl}img/0_50.jpg`,
    calib: {
      T: [
        [0.9978225033018392, 0.010224225350056775, 0.06515916758555136, -1.7144699660195162],
        [-0.011876615167048401, 0.9996163343723662, 0.025022591155348058, 0.10439561267679909],
        [-0.06487833164180895, -0.025741974903746672, 0.9975611022947065, -1.3624396711671496],
      ],
      ...R,
      // P: [
      //   [1417.091, 0, 1448.412, 0],
      //   [0, 1417.686, 591.138, 0],
      //   [0, 0, 0, 1],
      // ],
      P: [
        [0, -1417.091, 0, 1448.412],
        [0, 0, -1417.686, 591.138],
        [0, 0, 0, 0],
      ],
    },
  },
  {
    url: `${defaultUrl}img/0_52.jpg`,
    calib: {
      T: [
        [0.9985187321990899, -0.004293344471311228, 0.054239364310183016, -1.6748379427707825],
        [0.004252615601099711, 0.9999905823458756, 0.0008663025486269614, -0.08031008682645008],
        [-0.05424257283786763, -0.0006343601556966205, 0.9985275864387132, -1.3631156896591177],
      ],
      ...R,
      P: [
        [0, -5129.671, 0, 1450.547],
        [0, 0, -5135.966, 953.75],
        [0, 0, 0, 0],
      ],
    },
  },
  {
    url: `${defaultUrl}img/0_53.jpg`,
    calib: {
      // T: [
      //   [0.5044145505808691, 0.8051216445954001, -0.31200176051794665, -0.8576473411643886],
      //   [-0.8468669814771164, 0.5317953457251401, 0.003166377885840391, 1.0805916491282883],
      //   [0.16847040347235206, 0.26262682206712423, 0.9500762471953428, -1.7884827239988805],
      // ],
      T: [
        [0.5309949739168303, 0.8473484751871765, 0.00670069198154825, -1.3813720633807949],
        [-0.8473685810308583, 0.5310050733634979, 0.0003161391709057288, 1.0859522265933417],
        [-0.0032902213928343235, -0.005845824167138567, 0.9999775001383747, -1.4193050102365743],
      ],
      ...R,
      P: [
        [0, -900.635, 0, 1181.156],
        [0, 0, -900.041, 221.794],
        [0, 0, 0, 0],
      ],
    },
  },
  {
    url: `${defaultUrl}img/0_54.jpg`,
    calib: {
      // T: [
      //   [0.4964913355245847, -0.8175852190072093, -0.29163464027777647, -0.8906978990392798],
      //   [0.8564066747779303, 0.5161873242016334, 0.010874453060532181, -1.078829633273089],
      //   [0.14164731252241247, -0.2551569242534715, 0.9564679727312807, -1.7604035104286933],
      // ],
      T: [
        [0.5182138789484055, -0.8551811304044331, -0.010936629528483711, -1.352129885757621],
        [0.8552461034975166, 0.5182120399160615, 0.0032224429163790853, -1.0647120330461335],
        [0.0029117207218689527, -0.011023424433018195, 0.9999350008856612, -1.4471937338306353],
      ],
      ...R,
      P: [
        [0, -900.24, 0, 1169.676],
        [0, 0, -899.601, 343.662],
        [0, 0, 0, 0],
      ],
    },
  },
  {
    url: `${defaultUrl}img/0_55.jpg`,
    calib: {
      T: [
        [-0.7645657296416767, 0.6443881937546471, 0.014251344045871098, 1.2411212158818041],
        [-0.6444255199474803, -0.7646632899567912, 0.0024087824467680144, 2.1806770488917464],
        [0.01244967059444266, -0.0073422572877496605, 0.9998955430243757, -0.8771729440518458],
      ],
      ...R,
      P: [
        [0, -1009.983, 0, 911.228],
        [0, 0, -1007.537, 765.828],
        [0, 0, 0, 0],
      ],
    },
  },
  {
    url: `${defaultUrl}img/0_56.jpg`,
    calib: {
      T: [
        [-0.7694583840505016, -0.6384375368084203, 0.018201835302721944, 1.1864125768405345],
        [0.6386076698034204, -0.7685618545577068, 0.038638320189463615, -2.2592481099053345],
        [-0.010678917671562288, 0.04135441104422745, 0.9990874703470907, -0.7940119978533613],
      ],
      P: [
        [0, -1010.803, 0, 1438.117],
        [0, 0, -1006.444, 772.806],
        [0, 0, 0, 0],
      ],
      ...R,
    },
  },
  {
    url: `${defaultUrl}img/0_57.jpg`,
    calib: {
      T: [
        [-0.9999906322309504, 0.0005991062109886882, -0.004286784586626672, 0.39181469689308257],
        [-0.0005654516589098037, -0.9999690466287977, -0.007847677918652832, 0.027360792887524688],
        [-0.004291353488775001, -0.007845180433962616, 0.9999600179153131, -1.5308623012361884],
      ],
      P: [
        [0, -2065.413, 0, 1264.616],
        [0, 0, -2074.05, 348.923],
        [0, 0, 0, 0],
      ],
      ...R,
    },
  },
];

const data = [];

const polygonData = [];
// Array(1)
//   .fill('')
//   .map((v, i) => ({
//     id: i + 1,
//     sourceID: '',
//     pointList: Array(1000)
//       .fill('')
//       .map((_) => ({
//         x: Math.random() * 300,
//         y: Math.random() * 400,
//       })),
//     order: i + 1,
//     attribute: '',
//     valid: true,
//   }));

export const rectDefaultResult = JSON.stringify({
  height: 200,
  width: 100,
  rotate: 0,
  step_1: {
    dataSource: 0,
    tool: 'rectTool',
    result: data,
  },
});

export const polygonDefaultResult = JSON.stringify({
  height: 200,
  width: 100,
  rotate: 0,
  step_1: {
    dataSource: 0,
    tool: 'polygonTool',
    result: polygonData,
  },
});

export const tagDefaultResult = JSON.stringify({
  height: 200,
  width: 100,
  rotate: 0,
  step_1: {
    dataSource: 0,
    tool: 'tagTool',
    result: [],
  },
});

export const videoTagDefaultResult = JSON.stringify({
  step_1: {
    dataSource: 0,
    tool: 'videoTagTool',
    result: [],
  },
});

export const pointCloudResult = pointCloudResult1;

export const getMockResult = (tool) => {
  if (tool === 'rectTool') {
    return rectDefaultResult;
  }
  if (tool === 'tagTool') {
    return tagDefaultResult;
  }

  if (tool === 'polygonTool') {
    return polygonDefaultResult;
  }

  if (tool === 'videoTagTool') {
    return videoTagDefaultResult;
  }

  if (tool === 'pointCloudTool') {
    // // return `{"height":0,"rotate":0,"step_1":{"dataSourceStep":0,"toolName":"pointCloudTool","mask":"","maskMapping":null,"result":[{"attribute":"","center":{"x":44.696716,"y":-4.1707873,"z":-0.45224318},"depth":1.32,"height":1.48,"id":"459a06cd-9a25-44f8-9abb-9ead496fc9ae","rects":[{"height":22.779999,"imageName":"P2","trackID":0,"valid":true,"width":33.150024,"x":661.23,"y":174.85}],"rotation":-0.2207963,"sourceID":"","trackID":0,"valid":false,"width":4.44,"result":{"Car":"Car"},"subAttribute":{"occluded":"2","truncated":"0"}},{"attribute":"","center":{"x":26.70097,"y":9.502762,"z":0.2341046},"depth":4.02,"height":2.6,"id":"7be33e63-873a-4aef-8afb-013109a87f29","rects":[{"height":161.54999,"imageName":"P2","trackID":0,"valid":true,"width":348.92,"x":125.12,"y":91.71}],"rotation":2.942389,"sourceID":"","trackID":0,"valid":false,"width":16.79,"result":{"Truck":"Truck"},"subAttribute":{"occluded":"2","truncated":"0"}},{"attribute":"","center":{"x":33.416904,"y":-4.5626965,"z":-0.47425914},"depth":1.42,"height":1.56,"id":"53545afd-0c73-4e3f-a5a7-90bb7bc84d2c","rects":[{"height":33.069992,"imageName":"P2","trackID":0,"valid":true,"width":49.359985,"x":684.49,"y":172.19}],"rotation":-0.30079636,"sourceID":"","trackID":0,"valid":false,"width":4.16,"result":{"Car":"Car"},"subAttribute":{"occluded":"0","truncated":"0"}},{"attribute":"","center":{"x":6.339162,"y":3.6862226,"z":-0.915103},"depth":1.45,"height":1.59,"id":"e0b95dd3-6924-4acf-9593-dc10a684d13b","rects":[{"height":180.44,"imageName":"P2","trackID":0,"valid":true,"width":386.2,"x":0,"y":193.56}],"rotation":-0.33079633,"sourceID":"","trackID":0,"valid":false,"width":3.44,"result":{"Car":"Car"},"subAttribute":{"occluded":"0","truncated":"0.5"}},{"attribute":"","center":{"x":47.030163,"y":6.435039,"z":-0.83585465},"depth":1.44,"height":1.35,"id":"dafa9eeb-e98c-4dfd-91e3-379b5592512b","rects":[{"height":23.430008,"imageName":"P2","trackID":0,"valid":true,"width":33.02997,"x":494.45,"y":181.84}],"rotation":3.032389,"sourceID":"","trackID":0,"valid":false,"width":3.23,"result":{"Car":"Car"},"subAttribute":{"occluded":"0","truncated":"0"}},{"attribute":"","center":{"x":91.24807,"y":-0.7204353,"z":0.6906532},"depth":3.46,"height":2.57,"id":"0d827037-9b39-48ca-b972-cb073ad25fbd","rects":[{"height":29.87999,"imageName":"P2","trackID":0,"valid":true,"width":61.339966,"x":587.32,"y":158.63}],"rotation":-2.7807963,"sourceID":"","trackID":0,"valid":false,"width":14.66,"result":{"Tram":"Tram"},"subAttribute":{"occluded":"2","truncated":"0"}}]},"totalFrames":0,"valid":true,"width":0}`;

    return `{}`;
  }

  return '';
};

export const mockFileList = [
  {
    id: 1,
    url: 'http://bee-sdk-demo.sensebee.xyz/images/10.jpg',
    result:
      '{"width":720,"height":1280,"valid":true,"rotate":0,"step_1":{"dataSourceStep":0,"toolName":"rectTool","result":[{"x":272.47863247863245,"y":397.4928774928775,"width":288.0911680911681,"height":346.4387464387464,"attribute":"","valid":true,"id":"AwL2kecs","sourceID":"","textAttribute":"","order":1}]}}',
  },
  {
    id: 2,
    url: 'http://bee-sdk-demo.sensebee.xyz/images/19.jpg',
    result:
      '{"width":720,"height":1280,"valid":true,"rotate":0,"step_1":{"dataSourceStep":0,"toolName":"rectTool","result":[{"x":137.54985754985753,"y":262.56410256410254,"width":492.30769230769226,"height":525.1282051282051,"attribute":"","valid":true,"id":"iCXb9Lat","sourceID":"","textAttribute":"","order":1},{"x":133.9031339031339,"y":627.2364672364672,"width":357.3789173789174,"height":353.7321937321937,"attribute":"","valid":true,"id":"siLd255B","sourceID":"","textAttribute":"","order":2},{"x":640.7977207977208,"y":1061.196581196581,"width":79.2022792022792,"height":200.56980056980055,"attribute":"","valid":true,"id":"udXxQJou","sourceID":"","textAttribute":"","order":3}]}}',
  },
  {
    id: 3,
    url: 'http://bee-sdk-demo.sensebee.xyz/images/20.jpg',
    result:
      '{"width":720,"height":1280,"valid":true,"rotate":0,"step_1":{"dataSourceStep":0,"toolName":"rectTool","result":[{"x":144.84330484330485,"y":506.8945868945869,"width":324.55840455840456,"height":368.3190883190883,"attribute":"","valid":true,"id":"NFN0vzGW","sourceID":"","textAttribute":"","order":1},{"x":301.65242165242165,"y":328.2051282051282,"width":350.0854700854701,"height":386.5527065527065,"attribute":"","valid":true,"id":"t91AA81j","sourceID":"","textAttribute":"","order":2}]}}',
  },
  {
    id: 4,
    url: 'http://bee-sdk-demo.sensebee.xyz/images/66.jpg',
    result:
      '{"width":720,"height":1280,"valid":true,"rotate":0,"step_1":{"dataSourceStep":0,"toolName":"rectTool","result":[]}}',
  },
];

export const DEFAULT_ANNOTATIONS = [
  {
    type: 'rect',
    annotation: {
      id: '123123',
      x: 123,
      y: 23,
      width: 100,
      height: 100,
      stroke: 'pink',
      // thickness: 10,
      label: 'laoluo',
      attribute: 'asdasd',
      order: 1,
      // hiddenText: true
    },
  },
  {
    type: 'polygon',
    annotation: {
      id: '3',
      // thickness: 10,
      stroke: 'green',
      lineType: 1,
      pointList: [
        {
          x: 12,
          y: 123,
        },
        {
          x: 122,
          y: 123,
        },
        {
          x: 2,
          y: 3,
        },
      ],
    },
  },
  {
    type: 'line',
    annotation: {
      stroke: 'yellow',
      thickness: 5,
      id: '4',
      pointList: [
        {
          x: 123,
          y: 12,
        },
        {
          x: 2,
          y: 12,
        },
        {
          x: 34,
          y: 132,
        },
      ],
    },
  },
  {
    type: 'point',
    annotation: {
      id: '5',
      x: 10,
      y: 10,
      fill: 'green',
      stroke: 'blue',
      thickness: '20',
      radius: 10,
    },
  },
  {
    type: 'rect',
    annotation: {
      id: '10',
      x: 13,
      y: 3,
      width: 1020,
      height: 100,
    },
  },
  {
    type: 'text',
    annotation: {
      position: 'rt',
      id: '11',
      x: 223,
      y: 23,
      textMaxWidth: 416,
      color: 'yellow',
      text: '标签1: 测试1LoooooooooooooooooooooooooooooooooogLoooooooooooooooooooooooooooooooooogLoooooooooooooooooooooooooooooooooogLoooooooooooooooooooooooooooooooooogLoooooooooooooooooooooooooooooooooog\n标签2: 测试2sdasdas\n\n\n标签1: 测试1asdasdasd\n标签2: 测试2标签1: 测试1\n标签2: 测试2sdasdas\n标签1: 测试1asdasdasd\n标签2: 测试2标签1: 测试1\n标签2: 测试2sdasdas\n标签1: 测试1asdasdasd\n标签2: 测试2标签1: 测试1\n标签2: 测试2sdasdas\n标签1: 测试1asdasdasd\n标签2: 测试2标签1: 测试1\n标签2: 测试2sdasdas\n标签1: 测试1asdasdasd\n标签2: 测试2标签1: 测试1\n标签2: 测试2sdasdas\n标签1: 测试1asdasdasd\n标签2: 测试2',
    },
  },
  {
    type: 'text',
    annotation: {
      id: '12',
      x: 12,
      y: 123,
      textMaxWidth: 500,
      lineHeight: 25,
      text: 'Key: Loooooooooooooooooooooooooooooooooog value\nSecond One: short value',
    },
  },
  {
    type: 'rect',
    annotation: {
      id: 'g5r2l7mcrv8',
      x: 60,
      y: 260,
      width: 100,
      height: 100,
      stroke: 'pink',
      name: 'Bag',
      hiddenRectSize: true,
      renderEnhance: (params) => {
        const {
          ctx,
          data: { annotation },
          zoom,
          currentPos,
        } = params;

        ctx.fillStyle = annotation.stroke;

        ctx.fillRect(
          annotation.x * zoom + currentPos.x - 2,
          annotation.y * zoom + currentPos.y - 20 * zoom,
          40 * zoom,
          20 * zoom,
        );
        ctx.strokeStyle = 'white';
        ctx.strokeText(
          annotation.name,
          annotation.x * zoom + currentPos.x + 6 * zoom,
          annotation.y * zoom + currentPos.y - 7 * zoom,
        );
      },
    },
  },
];

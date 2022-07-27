// import { isInPolygon } from '@/utils/tool/polygonTool';
// import { PointCloudUtils } from '@labelbee/lb-utils';
// // let i = 0;

// // function timedCount() {
// //   i = i + 1;
// //   postMessage(i);
// //   setTimeout('timedCount()', 500);
// // }

// // timedCount();

// function rotatePoint(points, centerPoint, rotationZ) {
//   const pointVector = new THREE.Vector3(points.x, points.y, 1);
//   const Rz = new THREE.Matrix4().makeRotationZ(rotationZ);
//   const TFrom = new THREE.Matrix4().makeTranslation(centerPoint.x, centerPoint.y, centerPoint.z);
//   const TBack = new THREE.Matrix4().makeTranslation(-centerPoint.x, -centerPoint.y, -centerPoint.z);

//   return pointVector.clone().applyMatrix4(TBack).applyMatrix4(Rz).applyMatrix4(TFrom);
// }

// function getCuboidFromPointCloudBox(boxParams) {
//   const { center, width, height, depth, rotation } = boxParams;

//   const polygonPointList = [
//     {
//       x: center.x + width / 2,
//       y: center.y + height / 2,
//     },
//     {
//       x: center.x + width / 2,
//       y: center.y - height / 2,
//     },
//     {
//       x: center.x - width / 2,
//       y: center.y - height / 2,
//     },
//     {
//       x: center.x - width / 2,
//       y: center.y + height / 2,
//     },
//   ].map((v) => {
//     const vector = rotatePoint(v, center, rotation);
//     return {
//       x: vector.x,
//       y: vector.y,
//     };
//   });

//   const zMax = center.z + depth / 2;
//   const zMin = center.z - depth / 2;

//   return {
//     polygonPointList,
//     zMax,
//     zMin,
//   };
// }

// function filterPointsColor(boxParams, points, color) {
//   const { zMin, zMax, polygonPointList } = getCuboidFromPointCloudBox(boxParams);

//   for (let i = 0; i < points.length; i += 3) {
//     const x = points[i];
//     const y = points[i + 1];
//     const z = points[i + 2];

//     const inPolygon = isInPolygon({ x, y }, polygonPointList);

//     if (inPolygon && z >= zMin && z <= zMax) {
//       color[i] = 0;
//       color[i + 1] = 1;
//       color[i + 2] = 1;
//     } else {
//       // DEFAULT COLOR RENDERc
//       const [r, g, b] = PointCloudUtils.getStandardColorByCoord(x, y, z);
//       color[i] = r;
//       color[i + 1] = g;
//       color[i + 2] = b;
//     }
//   }
// }

// addEventListener(
//   'message',
//   function (e) {
//     console.log('I am worker', e.data, JSON.parse(e.data));
//     postMessage('haha');
//   },
//   false,
// );

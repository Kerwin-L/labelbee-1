import { point } from '@turf/turf';

function createColorMapJet() {
  let s;
  const p = new Array(256).fill('').map(() => new Array(3).fill(''));
  for (let i = 0; i < 20; i++) {
    for (s = 0; s < 32; s++) {
      p[s][0] = 128 + 4 * s;
      p[s][1] = 0;
      p[s][2] = 0;
    }
    p[32][0] = 255;
    p[32][1] = 0;
    p[32][2] = 0;
    for (s = 0; s < 63; s++) {
      p[33 + s][0] = 255;
      p[33 + s][1] = 4 + 4 * s;
      p[33 + s][2] = 0;
    }
    p[96][0] = 254;
    p[96][1] = 255;
    p[96][2] = 2;
    for (s = 0; s < 62; s++) {
      p[97 + s][0] = 250 - 4 * s;
      p[97 + s][1] = 255;
      p[97 + s][2] = 6 + 4 * s;
    }
    p[159][0] = 1;
    p[159][1] = 255;
    p[159][2] = 254;
    for (s = 0; s < 64; s++) {
      p[160 + s][0] = 0;
      p[160 + s][1] = 252 - s * 4;
      p[160 + s][2] = 255;
    }
    for (s = 0; s < 32; s++) {
      p[224 + s][0] = 0;
      p[224 + s][1] = 0;
      p[224 + s][2] = 252 - 4 * s;
    }
  }
  return p;
}

const COLOR_MAP_JET = createColorMapJet();

class PointCloudUtils {
  static genColorByCoord(x, y, z) {
    if (z <= 0) {
      return [128, 128, 128];
    }

    if (z < 5) {
      return [255, 0, 0];
    }

    if (z < 10) {
      return [0, 255, 0];
    }

    return [0, 0, 255];
  }

  // rendering multiple colors based on the z-axis
  static genColorByZ({ z, minZ, maxZ }) {
    const L = maxZ - minZ;

    // 1. JET
    const index = Math.floor(((z - minZ) / L) * 255);
    const color = COLOR_MAP_JET[index];

    return [color[0], color[1], color[2]];
  }

  static getStandardColorByCoord(x, y, z) {
    const pdColor = this.genColorByCoord(x, y, z);
    return pdColor.map((hex) => hex / 255);
  }
}

export function isInPolygon(checkPoint, polygonPoints, lineType = 0) {
  let counter = 0;
  let i;
  let xinters;
  let p1;
  let p2;

  polygonPoints = [...polygonPoints];
  if (lineType === 1) {
    polygonPoints = createSmoothCurvePoints(
      polygonPoints.reduce((acc, cur) => {
        return [...acc, cur.x, cur.y];
      }, []),
      0.5,
      true,
      SEGMENT_NUMBER,
    );
  }

  [p1] = polygonPoints;
  const pointCount = polygonPoints.length;

  for (i = 1; i <= pointCount; i++) {
    p2 = polygonPoints[i % pointCount];
    if (checkPoint.x > Math.min(p1.x, p2.x) && checkPoint.x <= Math.max(p1.x, p2.x)) {
      if (checkPoint.y <= Math.max(p1.y, p2.y)) {
        if (p1.x !== p2.x) {
          xinters = ((checkPoint.x - p1.x) * (p2.y - p1.y)) / (p2.x - p1.x) + p1.y;
          if (p1.y === p2.y || checkPoint.y <= xinters) {
            counter++;
          }
        }
      }
    }
    p1 = p2;
  }
  if (counter % 2 === 0) {
    return false;
  }
  return true;
}

function getNewColorByBox({ zMin, zMax, polygonPointList, attribute, x, y, z, colorList }) {
  const inPolygon = isInPolygon({ x, y }, polygonPointList);
  if (inPolygon && z >= zMin && z <= zMax) {
    if (colorList[attribute]) {
      return colorList[attribute].rgba.slice(0, 3).map((v) => v / 255);
    }

    return [1, 0, 0];
  }
}

onmessage = function onmessage(e) {
  const { position: points, color, cuboidList, colorList } = e.data;
  let num = 0;

  let maxZ = -Number.MAX_SAFE_INTEGER;
  let minZ = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < points.length; i += 3) {
    const z = points[i + 2];
    if (z) {
      if (z < minZ) {
        minZ = z;
      }
      if (z > maxZ) {
        maxZ = z;
      }
    }
  }

  //  Loop to determine if it is in range
  for (let i = 0; i < points.length; i += 3) {
    const x = points[i];
    const y = points[i + 1];
    const z = points[i + 2];

    // const inPolygon = isInPolygon({ x, y }, polygonPointList);
    const newColorInfo = cuboidList
      .map((v) => {
        return getNewColorByBox({
          polygonPointList: v.polygonPointList,
          zMin: v.zMin,
          zMax: v.zMax,
          x,
          y,
          z,
          attribute: v.attribute,
          colorList,
        });
        // const inPolygon = isInPolygon({ x, y }, v.polygonPointList);
        // if (inPolygon && z >= v.zMin && z <= v.zMax) {
        //   return [1, 0, 0];
        // }
        // return undefined;
      })
      .filter((v) => v)
      .pop();

    // // Notice. Scope: [0, 1];
    // if (inPolygon && z >= zMin && z <= zMax) {
    //   num++;
    //   color[i] = 1;
    //   color[i + 1] = 0;
    //   color[i + 2] = 0;
    // } else {
    //   // // DEFAULT COLOR RENDERc
    //   // Recover the originPoint

    //   // const [r, g, b] = PointCloudUtils.genColorByZ({ z, minZ, maxZ });
    //   const L = maxZ - minZ;
    //   // 1. JET
    //   const index = Math.floor(((z - minZ) / L) * 255);
    //   const newColor = COLOR_MAP_JET[index];
    //   const [r, g, b] = newColor;
    //   color[i] = r / 255;
    //   color[i + 1] = g / 255;
    //   color[i + 2] = b / 255;
    // }
    // Notice. Scope: [0, 1];
    if (newColorInfo) {
      num++;
      const [r, g, b] = newColorInfo;
      color[i] = r;
      color[i + 1] = g;
      color[i + 2] = b;
    } else {
      // // DEFAULT COLOR RENDERc
      // Recover the originPoint

      // const [r, g, b] = PointCloudUtils.genColorByZ({ z, minZ, maxZ });
      const L = maxZ - minZ;
      // 1. JET
      const index = Math.floor(((z - minZ) / L) * 255);
      const newColor = COLOR_MAP_JET[index];
      const [r, g, b] = newColor;
      color[i] = r / 255;
      color[i + 1] = g / 255;
      color[i + 2] = b / 255;
    }
  }

  postMessage({ points, color, num });
};

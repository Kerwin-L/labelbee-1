import { PCDLoader } from './PCDLoader';

export class PointCloudCache {
  public pcdLoader: PCDLoader;

  private pointsMap: Map<string, THREE.Points[]>;

  private static instance: PointCloudCache;

  private constructor() {
    this.pcdLoader = new PCDLoader();
    this.pointsMap = new Map();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new PointCloudCache();
    }
    return this.instance;
  }

  public loadPCDFile = (src: string) => {
    return new Promise((resolve, reject) => {
      // Cached
      if (this.pointsMap.get(src)) {
        resolve(this.pointsMap.get(src));
        return;
      }

      this.pcdLoader.load(
        src,
        (points: any) => {
          this.pointsMap.set(src, points.clone());
          resolve(points);
        },
        () => {},
        (err: string) => {
          reject(err);
        },
      );
    });
  };

  public getPointCloudPoints(src: string) {
    return this.pointsMap.get(src);
  }
}

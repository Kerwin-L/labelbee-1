import { IA2MapStateProps, a2MapStateToProps } from '@/store/annotation/map';
import { LabelBeeContext } from '@/store/ctx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AnnotationView from '@/components/AnnotationView';
import { connect } from 'react-redux';
import { PointCloudContext } from './PointCloudContext';
import { EPointCloudSegmentStatus } from '@labelbee/lb-utils';
import { lidar2image, pointsLidar2image, transferKitti2Matrix } from '@labelbee/lb-annotation';
import TitleButton from './components/TitleButton';

interface IProps extends IA2MapStateProps {
  checkMode?: boolean;
}

const PointCloudSegment2DView = ({ currentData, highlightAttribute }: IProps) => {
  const { ptSegmentInstance, cacheImageNodeSize, imageSizes } = useContext(PointCloudContext);
  const [point2ds, setPoint2ds] = useState([]);
  const pointProjectRef = useRef({});

  const highlight2DPoints = (indexes: number[]) => {
    // 2. projection.
    if (indexes) {
      console.time('calc 3D to 2D');
      // 2-2. Multi image.
      const list = [];
      currentData.mappingImgList?.forEach((mapping) => {
        console.log('imageSizes[mapping.path]', imageSizes[mapping.path]);
        if (imageSizes[mapping.path]) {
          const dataList = [];
          const cacheMap = pointProjectRef.current[mapping.path];
          const len = indexes.length;
          for (let i = 0; i < len; i = i + 1) {
            const point2d = cacheMap[indexes[i]];
            // Need to Update to multiPoint
            point2d &&
              dataList.push({
                type: 'rect',
                annotation: {
                  ...point2d,
                  width: 1,
                  height: 1,
                },
              });
          }

          list.push(dataList);
        }
      });

      setPoint2ds(list);

      console.timeEnd('calc 3D to 2D');
      console.log('points2d', list);
    }
  };
  useEffect(() => {
    if (ptSegmentInstance) {
      const highlightPointsByCachePoints = (data) => {
        if (data.cacheSegData) {
          // 1. get filterPoints: number[] [x,y,z,x,y,z,...]; Test first one.
          const { cacheSegData } = data;
          if (cacheSegData?.indexes) {
            highlight2DPoints(cacheSegData?.indexes);
          }
        }
      };

      const loadPCDFileEnd = () => {
        // init pointcloud mapping
        console.log(
          'ptSegmentInstance',
          ptSegmentInstance,
          ptSegmentInstance?.store?.pointCloudArray,
        );

        // const points = [];
        const points = ptSegmentInstance?.store?.originPoints;
        if (!points) {
          return;
        }

        const len = points.length;

        currentData.mappingImgList?.forEach((mapping) => {
          console.log('imageSizes[mapping.path]', imageSizes[mapping.path]);
          console.time('Create Maaping Map');
          const { P, R, T } = mapping.calib;
          const { composeMatrix4 } = transferKitti2Matrix(P, R, T);
          const filterSize = imageSizes[mapping.path];
          for (let i = 0; i < len; i = i + 3) {
            const point2d = lidar2image(
              {
                x: points[i * 3],
                y: points[i * 3 + 1],
                z: points[i * 3 + 2],
              },
              composeMatrix4,
            );
            if (!point2d) {
              continue;
            }

            // 1. Filter the points outside imgSize.
            if (
              point2d.x > filterSize.width ||
              point2d.y > filterSize.height ||
              point2d.x < 0 ||
              point2d.y < 0
            ) {
              continue;
            }
            if (!pointProjectRef.current[mapping.path]) {
              pointProjectRef.current[mapping.path] = {};
            }

            // pointProjectRef.current[mapping.path][
            //   `${points[i * 3]}-${points[i * 3 + 1]}-${points[i * 3] + 2}`
            // ] = point2d;
            pointProjectRef.current[mapping.path][i] = point2d;
          }

          console.timeEnd('Create Maaping Map');
        });

        // // if (data.segmentStatus === EPointCloudSegmentStatus.Check) {
        // if (data.cacheSegData) {
        //   // 1. get filterPoints: number[] [x,y,z,x,y,z,...]; Test first one.
        //   const { cacheSegData } = data;

        //   // 2. projection.
        //   if (cacheSegData?.points) {
        //     console.time('calc 3D to 2D');
        //     // const points =
        //     // ptSegmentInstance?.store?.filterPoints(cacheSegData.indexes);

        //     // 2-2. Multi imaga.
        //     const list = [];
        //     currentData.mappingImgList?.forEach((mapping) => {
        //       console.log('imageSizes[mapping.path]', imageSizes[mapping.path]);
        //       if (imageSizes[mapping.path]) {
        //         const { transferPoints } = pointsLidar2image(
        //           cacheSegData?.points,
        //           mapping.calib,
        //           imageSizes[mapping.path],
        //         );
        //         console.log('imageData', transferPoints, cacheSegData?.points, mapping);
        //         list.push(transferPoints);
        //       }
        //     });

        //     // setPoint2ds(list);

        //     console.timeEnd('calc 3D to 2D');
        //   }

        //   // 3.
        // }
      };

      ptSegmentInstance.on('syncPointCloudStatus', highlightPointsByCachePoints);

      ptSegmentInstance.on('loadPCDFileEnd', loadPCDFileEnd);

      return () => {
        ptSegmentInstance.unbind('syncPointCloudStatus', highlightPointsByCachePoints);
        ptSegmentInstance.unbind('loadPCDFileEnd', loadPCDFileEnd);
      };
    }
  }, [ptSegmentInstance, currentData, imageSizes]);

  useEffect(() => {
    // ptSegmentInstance?.store?.highlightPointsByAttribute(highlightAttribute ?? '');
    const indexesList = ptSegmentInstance?.store?.getHighlightAttribute(highlightAttribute ?? '');

    console.log('updateHighlight', highlightAttribute, indexesList);
    if (indexesList?.length > 0) {
      highlight2DPoints(indexesList?.[0]);
    } else {
      setPoint2ds([]);
    }
  }, [highlightAttribute, ptSegmentInstance]);

  const mappingImgList = currentData.mappingImgList;

  const afterImgOnLoad = (imgNode: HTMLImageElement, path: string) => {
    cacheImageNodeSize({
      path,
      imgNode,
    });

    console.log('afterImgOnLoad', ptSegmentInstance, ptSegmentInstance?.store?.pointCloudArray);
  };

  if (mappingImgList?.length > 0) {
    return (
      <div style={{ position: 'absolute' }}>
        {mappingImgList?.map((data, i) => (
          <>
            <AnnotationView
              key={data.path}
              src={data.url}
              annotations={point2ds[i]}
              afterImgOnLoad={(imgNode) => afterImgOnLoad(imgNode, data.path)}
            />
            <TitleButton title={'halou'} />
          </>
        ))}
      </div>
    );
  }
  return null;
};

export default connect(a2MapStateToProps, null, null, { context: LabelBeeContext })(
  PointCloudSegment2DView,
);

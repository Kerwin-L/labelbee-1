import React, { useContext, useEffect } from 'react';
import { PointCloudContext, useRotate } from './PointCloudContext';
import { cTool } from '@labelbee/lb-annotation';
import { message } from 'antd';
import { connect } from 'react-redux';
import { aMapStateToProps, IAnnotationStateProps } from '@/store/annotation/map';

const { EPolygonPattern } = cTool;

const PointCloudListener: React.FC<IAnnotationStateProps> = ({ currentData }) => {
  const ptCtx = useContext(PointCloudContext);
  const { updateRotate } = useRotate({ currentData });

  useEffect(() => {
    const { topViewInstance } = ptCtx;
    if (!topViewInstance) {
      return;
    }

    const { pointCloud2dOpeartion: TopPointCloudPolygonOperation } = topViewInstance;

    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.keyCode) {
        case 81: {
          // Q - anticlockwise
          updateRotate(2);
          break;
        }

        case 69:
          // E - closewise
          updateRotate(-2);

          break;

        case 71:
          // G ， overturn 180
          updateRotate(180);

          break;

        case 85:
          {
            // U , change TopOpereation Pattern
            const newPattern =
              TopPointCloudPolygonOperation.pattern === EPolygonPattern.Normal
                ? EPolygonPattern.Rect
                : EPolygonPattern.Normal;
            TopPointCloudPolygonOperation.setPattern(newPattern);
            const POLYGON_PATTERN = {
              [EPolygonPattern.Normal]: 'Normal Pattern',
              [EPolygonPattern.Rect]: 'Rect Pattern',
            };
            message.success(`Change Pattern to ${POLYGON_PATTERN[newPattern]} successfully`);

            // Clear Status
            TopPointCloudPolygonOperation.clearActiveStatus();
            TopPointCloudPolygonOperation.clearDrawingStatus();
          }

          break;

        default: {
          return;
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [ptCtx]);

  return null;
};

export default connect(aMapStateToProps)(PointCloudListener);

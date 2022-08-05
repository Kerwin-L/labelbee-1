import { getClassName } from '@/utils/dom';
import React, { useContext } from 'react';
import { PointCloudContainer } from './PointCloudLayout';
import AnnotationView from '@/components/AnnotationView';
import { PointCloudContext } from './PointCloudContext';
// import { point2d } from './data';

const imgPath = 'http://127.0.0.1:8080/image_undistort/center_camera_fov120/1.png';

const calib = 'fov120';

const PointCloud2DView = () => {
  const { annotations2d } = useContext(PointCloudContext);

  const size = {
    width: 1000,
    height: 300,
  };
  return (
    <PointCloudContainer className={getClassName('point-cloud-2d-container')} title='2D视图'>
      <div
        className={getClassName('point-cloud-2d-image')}
        // style={size}
      >
        {/* <img src='http://127.0.0.1:8080/image_undistort/center_camera_fov120/2022-02-20-12-21-03-000.png' /> */}
        <AnnotationView src={imgPath} annotations={annotations2d} />
        {/* <AnnotationView src={imgPath} annotations={annotations2d} size={size} /> */}
      </div>
    </PointCloudContainer>
  );
};

export default PointCloud2DView;

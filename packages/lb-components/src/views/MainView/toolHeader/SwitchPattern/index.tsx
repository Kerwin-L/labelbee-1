/**
 * Switch Pattern in PointCloudTool
 *
 * 1. Direction
 * 2. Segmentation
 */
import React, { useContext } from 'react';
import { EPointCloudName } from '@labelbee/lb-annotation';
import { EPointCloudPattern } from '@labelbee/lb-utils';
import { Button } from 'antd';
import { AppState } from '@/store';
import { connect } from 'react-redux';
import { LabelBeeContext } from '@/store/ctx';
import { PointCloudContext } from '@/components/pointCloudView/PointCloudContext';
import { useTranslation } from 'react-i18next';

interface IProps {
  toolName: string;
}

const SwitchPattern = ({ toolName }: IProps) => {
  const { t } = useTranslation();
  const {
    globalPattern,
    setGlobalPattern,
    setTopViewInstance,
    setSideViewInstance,
    setBackViewInstance,
    setMainViewInstance,
    ptSegmentInstance,
    setSelectedIDs,
  } = useContext(PointCloudContext);

  if (toolName !== EPointCloudName.PointCloud) {
    return null;
  }

  const clearDetection = () => {
    setSelectedIDs([]);
    setTopViewInstance(undefined);
    setSideViewInstance(undefined);
    setBackViewInstance(undefined);
    setMainViewInstance(undefined);
  };

  const clearSegmentation = () => {
    ptSegmentInstance?.emit('clearStash');
  };

  const updateDetection = () => {
    clearSegmentation();
    setGlobalPattern(EPointCloudPattern.Detection);
  };
  const updateSegmentation = () => {
    clearDetection();
    setGlobalPattern(EPointCloudPattern.Segmentation);
  };

  return (
    <span style={{ margin: '0 10px' }}>
      <Button
        type={globalPattern === EPointCloudPattern.Detection ? 'primary' : undefined}
        onClick={updateDetection}
      >
        {t('DetectionMode')}
      </Button>
      <Button
        type={globalPattern === EPointCloudPattern.Segmentation ? 'primary' : undefined}
        onClick={updateSegmentation}
      >
        {t('SegmentationMode')}
      </Button>
    </span>
  );
};

const mapStateToProps = (state: AppState) => ({
  toolName: state.annotation.stepList[state.annotation.step - 1]?.tool ?? '',
});

export default connect(mapStateToProps, null, null, { context: LabelBeeContext })(SwitchPattern);
import {
  Col,
  Collapse,
  CollapseProps,
  Descriptions,
  DescriptionsProps,
  Input,
  Row,
} from 'antd';
import { useState } from 'react';
import { DataKey, GlobalTrainsMapType } from './types';

// TODO how to make global use
// 扩展 Window 接口
declare global {
  interface Window {
    PM_trainsMap: GlobalTrainsMapType;
  }
}
window.PM_trainsMap = window.PM_trainsMap || {};

const fullInfoKeyToName: { [key: string]: string } = {
  operateGroup: '担当路局',
  trainCategory: '列车型号',
  trainNumber: '车次',
  runTime: '运行时间',
  fromStation: '始发站',
  toStation: '到达站',
  departureTime: '发车时间',
  arrivalTime: '到站时间',
  trainType: '列车类型',
  distance: '里程',
};

const SearchResult = ({
  dataKey,
  value,
}: {
  dataKey: DataKey;
  value: string;
}) => {
  if (!value) {
    return null;
  }

  const searchResultItems: CollapseProps['items'] =
    window.PM_trainsMap[dataKey] &&
    Object.keys(window.PM_trainsMap[dataKey])
      .filter((trainNumber) => {
        return trainNumber.includes(value);
      })
      .filter((trainNumber) => {
        if (!window.PM_trainsMap.trainsFullInfoMap[trainNumber]) {
          console.log(
            `trainNumber ${trainNumber} not found in trainsFullInfoMap`
          );
          return false;
        }
        return true;
      })
      .map((trainNumber) => {
        const train = window.PM_trainsMap[dataKey][trainNumber];
        const trainFullInfo =
          window.PM_trainsMap.trainsFullInfoMap[trainNumber];
        const trainFullInfoItems: DescriptionsProps['items'] = Object.keys(
          trainFullInfo
        ).map((key) => {
          return {
            key,
            label: fullInfoKeyToName[key],
            children: trainFullInfo[key as 'operateGroup'],
          };
        });

        return {
          key: trainNumber,
          label: `${trainNumber} ${train.from_station} - ${train.to_station}`,
          children: (
            <div>
              <span>
                <a
                  href={`https://shike.gaotie.cn/checi.asp?CheCi=${trainNumber}`}
                  target='_blank'
                >
                  {trainNumber}
                </a>
              </span>{' '}
              {train.from_station} - {train.to_station}
              <Descriptions
                title='Train Full Info'
                items={trainFullInfoItems}
              />
            </div>
          ),
        };
      });

  return (
    <div className='pm-search-result'>
      <Collapse items={searchResultItems} defaultActiveKey={['1']} />;
    </div>
  );
};

const SearchTrain = () => {
  const [value, setValue] = useState('');
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ marginLeft: '50px' }}>
        <Input
          placeholder='Search train'
          style={{
            width: '80%',
            margin: '20px auto',
            display: 'block',
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <Row>
        <Col span={12}>
          <SearchResult dataKey='trainsMap' value={value} />
        </Col>
        <Col span={12}>
          <SearchResult dataKey='trainsMap2' value={value} />
        </Col>
      </Row>
    </div>
  );
};

export default SearchTrain;

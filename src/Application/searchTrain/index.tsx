import {
  Checkbox,
  CheckboxProps,
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

const searchTrainByNum = (
  isExactMatch: boolean,
  trainNumber: string, // e.g. K1331
  trainNum: string // e.g. 1331
) => {
  if (!isExactMatch) {
    // "1" will match "G1" and "G12"
    return trainNumber.includes(trainNum);
  }
  // "1" will match "G1" or "K1", but not match "G12"
  const regex = new RegExp(`^[A-Z]${trainNum}$`);
  return regex.test(trainNumber);
};

const SearchResult = ({
  dataKey,
  isExactMatch,
  value,
}: {
  dataKey: DataKey;
  isExactMatch: boolean;
  value: string;
}) => {
  if (!value) {
    return null;
  }

  const searchResultItems: CollapseProps['items'] =
    window.PM_trainsMap[dataKey] &&
    Object.keys(window.PM_trainsMap[dataKey])
      .filter((trainNumber) => {
        return searchTrainByNum(isExactMatch, trainNumber, value);
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
              <Descriptions
                // title='Train Full Info'
                items={trainFullInfoItems}
                bordered
              />
              <div>
                <a
                  href={`https://shike.gaotie.cn/checi.asp?CheCi=${trainNumber}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  See more details
                </a>
              </div>
            </div>
          ),
        };
      });

  return (
    <div className='pm-search-result'>
      <Collapse items={searchResultItems} defaultActiveKey={['1']} />
    </div>
  );
};

const SearchTrain = () => {
  const [value, setValue] = useState('');
  const [isExactMatch, setIsExactMatch] = useState(true);
  const onChange: CheckboxProps['onChange'] = (e) => {
    setIsExactMatch(e.target.checked);
  };
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
        <Checkbox checked={isExactMatch} onChange={onChange}>
          Exactly Match
        </Checkbox>
      </div>
      <SearchResult
        dataKey='trainsMap'
        isExactMatch={isExactMatch}
        value={value}
      />
    </div>
  );
};

export default SearchTrain;

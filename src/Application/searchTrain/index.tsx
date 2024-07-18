import { Col, Input, Row } from 'antd';
import { useState } from 'react';

// TODO how to make global use
// 扩展 Window 接口
declare global {
  interface Window {
    PM_trainsMap: any; // 你可以根据实际类型替换 `any`
  }
}
window.PM_trainsMap = window.PM_trainsMap || {};

const SearchResult = ({
  dataKey,
  value,
}: {
  dataKey: string;
  value: string;
}) => {
  if (!value) {
    return null;
  }
  return (
    <div className='pm-search-result'>
      {window.PM_trainsMap[dataKey] &&
        Object.keys(window.PM_trainsMap[dataKey])
          .filter((trainNumber) => {
            return trainNumber.includes(value);
          })
          .map((trainNumber) => {
            const train = window.PM_trainsMap[dataKey][trainNumber];
            return (
              <div key={trainNumber}>
                {trainNumber} - {train.from_station} to {train.to_station}
              </div>
            );
          })}
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

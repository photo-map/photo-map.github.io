import { Input } from 'antd';
import { useState } from 'react';

// TODO how to make global use
// 扩展 Window 接口
declare global {
  interface Window {
    PM_trainsMap: any; // 你可以根据实际类型替换 `any`
  }
}

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
      <div>
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
      <div>
        <div id='trainList'>
          {window.PM_trainsMap &&
            Object.keys(window.PM_trainsMap)
              .filter((trainNumber) => {
                return trainNumber.includes(value);
              })
              .map((trainNumber) => {
                const train = window.PM_trainsMap[trainNumber];
                return (
                  <div key={trainNumber}>
                    {trainNumber} - {train.from_station} to {train.to_station}
                  </div>
                );
              })}
        </div>
        <div id='trainList2'></div>
      </div>
    </div>
  );
};

export default SearchTrain;

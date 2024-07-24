/**
 * window.PM_trainsMap={
 *   "trainsMap": {
 *     "G372": {
 *       "from_station": "",
 *       "to_station": ""
 *     }
 *   },
 *   "trainsFullInfoMap": {
 *     "G1": {
 *       "operateGroup": "上海局",
 *       "trainCategory": "复兴号(CR400BF-B型)",
 *       "trainNumber": "G1",
 *       "runTime": "4小时29分",
 *       "fromStation": "北京南站",
 *       "toStation": "上海站",
 *       "departureTime": "07:00",
 *       "arrivalTime": "11:29",
 *       "trainType": "高速动车组列车(高铁)",
 *       "distance": "1325 "
 *     },
 *   }
 * }
 */
export type TrainsMapType = {
  [trainNumber: string]: {
    from_station: string;
    to_station: string;
  };
};

export type TrainFullInfoType = {
  operateGroup: string; // 担当路局, e.g. "成都局"
  trainCategory: string; // 列车型号, e.g. "和谐号(CRH380A型)""
  trainNumber: string; // 车次, e.g. "G372"
  runTime: string; // 运行时间, e.g. "12小时8分"
  fromStation: string; // 始发站, e.g. "贵阳北"
  toStation: string; // 到达站, e.g. "北京西"
  departureTime: string; // 发车时间, e.g. "09:31"
  arrivalTime: string; // 到站时间, e.g. "21:39"
  trainType: string; // 列车类型, e.g. "高速动车组列车(高铁)"
  distance: string; // 里程, e.g. "2138"
};

export type TrainsFullInfoType = {
  [trainNumber: string]: TrainFullInfoType;
};

export type GlobalTrainsMapType = {
  trainsMap: TrainsMapType;
  trainsFullInfoMap: TrainsFullInfoType;
};

export type DataKey = 'trainsMap';

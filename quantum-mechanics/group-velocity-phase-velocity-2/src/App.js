import { useEffect, useState } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import './App.css';

const C = 299792458; // m/s
const π = Math.PI;

function sin(k, x, omega, t = 0) {
  return Math.sin(k * x - omega * t);
}

function getSinData(t, wl = 700) {
  const wavelength = wl * 10e-7; // 700nm red light
  const frequency = C / wavelength;
  const k = 2 * π / wavelength;
  const omega = 2 * π * frequency;

  const length = 1000 * 10e-7 * 16;
  const steps = 400;
  const step = length / steps;

  const data = [];
  for(let x = 0; x < length; x += step) {
    data.push({ val: sin(k, x, omega, t) });
  }

  return data;
}

let t = 0;
let w1 = 700;
let w2 = 650;

function App() {
  const d1 = getSinData(0, w1);
  const d2 = getSinData(0, w2);
  const [data1, setData1] = useState(d1, []);
  const [data2, setData2] = useState(d2, []);
  const ds = d1.map((d, i) => ({ val: d.val + d2[i]?.val ?? 0 }));
  const [dataSum, setDataSum] = useState(ds, []);

  function update() {
    t += 5 * 10e-15;
    const d11 = getSinData(t, w1);
    const d22 = getSinData(t, w2);
    setData1(d11);
    setData2(d22);

    const dsum = d11.map((d, i) => ({ val: d.val + d22[i]?.val ?? 0 }));
    setDataSum(dsum);
  };

  useEffect(() => {
    setTimeout(() => {
      update();
    }, 1000 / 60);
  });

  return (
    <div className="App">
      <div className="chart">
        <LineChart
          width={680}
          height={120}
          data={data1}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="val"
            stroke="#8884d8"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </div>
      <div className="chart">
        <LineChart
          width={680}
          height={120}
          data={data2}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="val"
            stroke="#d884d8"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </div>
      <div className="chart">
        <LineChart
          width={680}
          height={240}
          data={dataSum}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis />
          <YAxis domain={[-2, 2]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="val"
            stroke="#843833"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </div>
    </div>
  );
}

export default App;

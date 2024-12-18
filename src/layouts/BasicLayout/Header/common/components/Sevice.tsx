import { FC } from 'react';
import { Select } from 'antd';

const Sevice: FC = () => {
  const handleServiceChange = (value: string) => {
    window.localStorage.setItem('service', value);
  };

  return (
    <>
      <Select
        disabled
        value={window.localStorage.getItem('service') ?? 'Java'}
        style={{ width: 100 }}
        onChange={handleServiceChange}
        options={[
          {
            value: 'Rust',
            label: 'Rust',
          },
          {
            value: 'Java',
            label: 'Java',
          },
        ]}
      />
    </>
  );
};

export default Sevice;

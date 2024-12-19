import { Component, FC, LegacyRef, useEffect, useRef, useState } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { PickerProps } from 'antd/lib/date-picker/generatePicker';

type TCustomDatePickProps = {
  format?: string;
  displayFormat?: string;
  value?: string;
  onChange?: any;
};

const CustomDatePick: FC<TCustomDatePickProps> = ({
  format,
  displayFormat,
  value,
  onChange,
}) => {
  const [dateValue, setDateValue] = useState<any>();
  const inputDisplayRef = useRef<Component<PickerProps<Moment>>>(null);

  useEffect(() => {}, []);

  useEffect(() => {
    if (value) {
      const date = moment(value, format ?? 'YYYY-MM-DDTHH:mm:ssZ');
      setDateValue(date);
    }
  }, [value]);

  const handleChange = (value: any, dateString: string) => {
    const dateStr = (value as Moment).format(format ?? 'YYYY-MM-DDTHH:mm:ssZ');
    onChange(dateStr);
  };

  return (
    <>
      <DatePicker
        allowClear
        onChange={handleChange}
        value={dateValue}
        ref={inputDisplayRef}
        format={displayFormat ?? 'YYYY-MM-DD HH:mm:ss'}
        showTime
      />
    </>
  );
};

export default CustomDatePick;

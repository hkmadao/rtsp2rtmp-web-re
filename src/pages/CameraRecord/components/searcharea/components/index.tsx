import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Form, Input, InputNumber, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import RefPicker from '@/components/Ref';
import { Observer, TMessage } from '@/util/observer';
import CustomDatePick from '@/components/CustomDatePick';
import { subject, queryConf } from '../../../conf';
import { useFgDisabled, useFgHidden, useIdUiConf } from '../hooks';

const SearchAreaComponent: FC<{}> = ({}) => {
  const idUiConf = useIdUiConf();
  const fgDisabled = useFgDisabled();
  const fgHidden = useFgHidden();
  const searcheRefs = queryConf?.searchRefs;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const searchValuesRef = useRef<any>({});

  useEffect(() => {
    if (!idUiConf) {
      return;
    }

    const treeNodeObserver: Observer = {
      topic: 'treeNodeSelected',
      consumerId: idUiConf!,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf!)) {
            return;
          }
          form.resetFields();
        })();
      },
    };
    subject.subscribe(treeNodeObserver);

    const treeNodeCancelObserver: Observer = {
      topic: 'treeSelectCancel',
      consumerId: idUiConf!,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idUiConf!)) {
            return;
          }
        })();
      },
    };
    subject.subscribe(treeNodeCancelObserver);

    //销毁观察者
    return () => {
      subject.unsubsribe(treeNodeObserver);
      subject.unsubsribe(treeNodeCancelObserver);
    };
  }, [idUiConf]);

  useEffect(() => {
    const newValues: any = {};
    newValues.fgTemp = 'all';
    newValues.fgRemove = 'all';
    form.setFieldsValue(newValues);
    searchValuesRef.current = newValues;
  }, [searcheRefs]);

  const handleValuesChange = (changedValues: any, values: any) => {
    const newValues = { ...values };
    searchValuesRef.current = newValues;
  };

  const handleSearch = async () => {
    let searchValues: any = {};
    searcheRefs?.forEach((searchRef) => {
      let attributeName = searchRef.attributeName;
      if (!attributeName) {
        console.warn('searchRef attributeName is undefind');
        return;
      }
      if (searchRef.htmlInputType === 'Ref') {
        let refAttributeName = searchRef.refAttributeName;
        if (!refAttributeName) {
          console.warn('searchRef refAttributeName is undefind');
          return;
        }
        if (!searchValuesRef.current[refAttributeName]) {
          return;
        }
        let backWriteProp = searchRef.refConfig?.backWriteProp;
        if (!backWriteProp) {
          console.warn('searchRef refConfig backWriteProp is undefind');
          return;
        }
        searchValues[attributeName] =
          searchValuesRef.current[refAttributeName][backWriteProp];
        return;
      }
      searchValues[attributeName] = searchValuesRef.current[attributeName];
    });
    subject.publish({
      topic: 'search',
      producerId: idUiConf!,
      data: searchValues,
    });
  };

  return (
    <>
      <div
        style={{
          display: fgHidden ? 'none' : 'block',
        }}
      >
        <Form form={form} layout={'inline'} onValuesChange={handleValuesChange}>
          <Form.Item
            label={'文件名称'}
            name={'fileName'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input allowClear placeholder={'请输入文件名称'} />
          </Form.Item>
          <Form.Item
            label={'临时文件标志'}
            name={'fgTemp'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Select placeholder={'请选择'}>
              <Select.Option value={'all'}>全部</Select.Option>
              <Select.Option value={'true'}>是</Select.Option>
              <Select.Option value={'false'}>否</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={'文件删除标志'}
            name={'fgRemove'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Select placeholder={'请选择'}>
              <Select.Option value={'all'}>全部</Select.Option>
              <Select.Option value={'true'}>是</Select.Option>
              <Select.Option value={'false'}>否</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={'开始时间大于'}
            name={'startTimeGt'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <CustomDatePick
              format="YYYY-MM-DDTHH:mm:ssZ"
              displayFormat="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item
            label={'开始时间小于'}
            name={'startTimeLt'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <CustomDatePick
              format="YYYY-MM-DDTHH:mm:ssZ"
              displayFormat="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item style={{ padding: '5px 0px 5px 0px' }}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleSearch}
              disabled={fgDisabled}
            >
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default SearchAreaComponent;

import { FC, useEffect, useRef, useState } from 'react';
import { Form, Input, InputNumber, Checkbox, Space, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { EPartName, TTree } from '@/models';
import { Observer, TMessage } from '@/util/observer';
import RefPicker from '@/components/Ref';
import CustomDatePick from '@/components/CustomDatePick';
import CustomTimePicker from '@/components/CustomTimePicker';
import { TCameraRecord } from '../../../models';
import { getRefByAttr } from '@/util';
import { billformConf, subject } from '../../../conf';
import { actions, toEdit, save, reflesh } from './store';
import {
  useEditStatusInfo,
  useFormData,
  useIdUiConf,
  useFgDisabled,
} from './hooks';
const MainFormLayout: FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const idUiConf = useIdUiConf();
  const fgDisabled = useFgDisabled();
  const moduleData = useFormData();
  const editStatus = useEditStatusInfo();

  useEffect(() => {
    if (editStatus) {
      form.resetFields();
      form.setFieldsValue(moduleData);
    }
  }, [editStatus]);

  useEffect(() => {
    if (!idUiConf) {
      return;
    }

    const cancleObserver: Observer = {
      topic: 'cancel',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idUiConf)) {
          return;
        }
        dispatch(actions.cancel());
      },
    };
    subject.subscribe(cancleObserver);

    const toAddObserver: Observer = {
      topic: 'toAdd',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idUiConf)) {
          return;
        }
        dispatch(
          actions.addFormData({ nodeData: message.data.treeSelectedNode }),
        );
      },
    };
    subject.subscribe(toAddObserver);

    const addObserver: Observer = {
      topic: 'add',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (message.consumerIds.includes(idUiConf)) {
            return;
          }
          const data = await form.validateFields();
          dispatch(save({ actionType: 'add' }));
        })();
      },
    };
    subject.subscribe(addObserver);

    const addAgainObserver: Observer = {
      topic: 'addAgain',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (message.consumerIds.includes(idUiConf)) {
            return;
          }
          const data = await form.validateFields();
          dispatch(save({ actionType: 'addAgain' }));
        })();
      },
    };
    subject.subscribe(addAgainObserver);

    const toEditObserver: Observer = {
      topic: 'toEdit',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(
            toEdit({
              nodeData: message.data.treeSelectedNode,
              selectedRow: message.data.selectedRow,
            }),
          );
        })();
      },
    };
    subject.subscribe(toEditObserver);

    const editObserver: Observer = {
      topic: 'edit',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (message.consumerIds.includes(idUiConf)) {
            return;
          }
          const data = await form.validateFields();
          dispatch(save({ actionType: 'edit' }));
        })();
      },
    };
    subject.subscribe(editObserver);

    const detailRefleshObserver: Observer = {
      topic: 'detailReflesh',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(reflesh());
        })();
      },
    };
    subject.subscribe(detailRefleshObserver);

    //销毁观察者
    return () => {
      subject.unsubsribe(cancleObserver);
      subject.unsubsribe(toAddObserver);
      subject.unsubsribe(addObserver);
      subject.unsubsribe(addAgainObserver);
      subject.unsubsribe(toEditObserver);
      subject.unsubsribe(editObserver);
      subject.unsubsribe(detailRefleshObserver);
    };
  }, [idUiConf]);

  const handleValuesChange = (changedValues: any, values: TCameraRecord) => {
    const newValues = { ...values };
    if (!newValues.camera) {
      newValues.idCamera = undefined;
    } else {
      newValues.idCamera = newValues.camera.id;
    }
    dispatch(actions.updateFormData(newValues));
  };

  return (
    <>
      <Form form={form} layout={'inline'} onValuesChange={handleValuesChange}>
        <Space direction="horizontal" size={2} wrap={true}>
          <Form.Item
            label={'记录id'}
            name={'idCameraRecord'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入记录id'}
            />
          </Form.Item>
          <Form.Item
            label={'文件名称'}
            name={'fileName'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入文件名称'}
            />
          </Form.Item>
          <Form.Item
            label={'开始时间'}
            name={'startTime'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <CustomDatePick
              format="YYYY-MM-DDTHH:mm:ssZ"
              displayFormat="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item
            label={'结束时间'}
            name={'endTime'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <CustomDatePick
              format="YYYY-MM-DDTHH:mm:ssZ"
              displayFormat="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item
            label={'文件时长'}
            name={'duration'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <InputNumber readOnly={fgDisabled} placeholder={'请输入文件时长'} />
          </Form.Item>
          <Form.Item
            label={'摄像头'}
            name={'camera'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <RefPicker
              {...getRefByAttr(
                EPartName.Header,
                'cameraRecord',
                'idCamera',
                billformConf!,
              )!}
            />
          </Form.Item>
          <Form.Item
            label={'创建时间'}
            name={'created'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <CustomDatePick
              format="YYYY-MM-DDTHH:mm:ssZ"
              displayFormat="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item
            label={'文件删除标志'}
            name={'fgRemove'}
            style={{ padding: '5px 0px 5px 0px' }}
            valuePropName="checked"
          >
            <Checkbox disabled={fgDisabled} />
          </Form.Item>
          <Form.Item
            label={'临时文件标志'}
            name={'fgTemp'}
            style={{ padding: '5px 0px 5px 0px' }}
            valuePropName="checked"
          >
            <Checkbox disabled={fgDisabled} />
          </Form.Item>
          <Form.Item
            label={'临时文件名称'}
            name={'tempFileName'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入临时文件名称'}
            />
          </Form.Item>
        </Space>
      </Form>
    </>
  );
};

export default MainFormLayout;

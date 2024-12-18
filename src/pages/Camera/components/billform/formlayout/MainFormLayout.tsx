import { FC, useEffect, useRef, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  Space,
  Select,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { EPartName, TTree } from '@/models';
import { Observer, TMessage } from '@/util/observer';
import RefPicker from '@/components/Ref';
import CustomDatePick from '@/components/CustomDatePick';
import CustomTimePicker from '@/components/CustomTimePicker';
import {
  TCamera,
} from '../../../models';
import { getRefByAttr } from '@/util';
import { billformConf, subject } from '../../../conf';
import {
  actions,
  toEdit,
  save,
  reflesh,
} from './store';
import { useEditStatusInfo, useFormData, useIdUiConf, useFgDisabled, } from './hooks';
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
      topic: 'cancle',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idUiConf)) {
          return;
        }
        dispatch(actions.cancle());
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
        dispatch(actions.addFormData({ nodeData: message.data.treeSelectedNode }));
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
          dispatch(toEdit({ nodeData: message.data.treeSelectedNode, selectedRow: message.data.selectedRow }));
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

  const handleValuesChange = (changedValues: any, values: TCamera) => {
    const newValues = { ...values };
    dispatch(actions.updateFormData(newValues));
  }

  return (
    <>
      <Form form={form} layout={'inline'} onValuesChange={handleValuesChange}>
        <Space direction="horizontal" size={2} wrap={true}>
          <Form.Item
            label={'摄像头主属性'}
            name={'id'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled || true }
              allowClear
              placeholder={
                '请输入摄像头主属性'
              }
            />
          </Form.Item>
          <Form.Item
            label={'编号'}
            name={'code'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled }
              allowClear
              placeholder={
                '请输入编号'
              }
            />
          </Form.Item>
          <Form.Item
            label={'rtsp地址'}
            name={'rtspUrl'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled }
              allowClear
              placeholder={
                '请输入rtsp地址'
              }
            />
          </Form.Item>
          <Form.Item
            label={'rtmp推送地址'}
            name={'rtmpUrl'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled }
              allowClear
              placeholder={
                '请输入rtmp推送地址'
              }
            />
          </Form.Item>
          <Form.Item
            label={'播放权限码'}
            name={'playAuthCode'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled }
              allowClear
              placeholder={
                '请输入播放权限码'
              }
            />
          </Form.Item>
          <Form.Item
            label={'在线状态'}
            name={'onlineStatus'}
            style={{ padding: '5px 0px 5px 0px' }}
            valuePropName="checked"
          >
            <Checkbox disabled={fgDisabled || true }/>
          </Form.Item>
          <Form.Item
            label={'启用状态'}
            name={'enabled'}
            style={{ padding: '5px 0px 5px 0px' }}
            valuePropName="checked"
          >
            <Checkbox disabled={fgDisabled || true }/>
          </Form.Item>
          <Form.Item
            label={'rtmp推送状态'}
            name={'rtmpPushStatus'}
            style={{ padding: '5px 0px 5px 0px' }}
            valuePropName="checked"
          >
            <Checkbox disabled={fgDisabled || true }/>
          </Form.Item>
          <Form.Item
            label={'保存录像状态'}
            name={'saveVideo'}
            style={{ padding: '5px 0px 5px 0px' }}
            valuePropName="checked"
          >
            <Checkbox disabled={fgDisabled || true }/>
          </Form.Item>
          <Form.Item
            label={'直播状态'}
            name={'live'}
            style={{ padding: '5px 0px 5px 0px' }}
            valuePropName="checked"
          >
            <Checkbox disabled={fgDisabled || true }/>
          </Form.Item>
          <Form.Item
            label={'创建时间'}
            name={'created'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            {/* <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime={true}
            /> */}
            <CustomDatePick 
              format="YYYY-MM-DD HH:mm:ss"
              displayFormat='YYYY-MM-DD HH:mm:ss'
              showTime={true} 
            />
          </Form.Item>
        </Space>
      </Form>
    </>
  );
};

export default MainFormLayout;

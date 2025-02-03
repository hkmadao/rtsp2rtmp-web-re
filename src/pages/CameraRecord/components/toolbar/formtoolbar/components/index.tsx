import { FC, useEffect } from 'react';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Observer, TMessage } from '@/util/observer';
import { subject, actionFormConf } from '../../../../conf';
import { useFgAdd, useFgDisabled, useIdUiConf } from '../hooks';
import { actions } from '../store';

const FromToolBarComponent: FC<{}> = ({}) => {
  const idUiConf = useIdUiConf();
  const fgDisabled = useFgDisabled();
  const fgAdd = useFgAdd();
  const dispatch = useDispatch();

  useEffect(() => {
    const toAddObserver: Observer = {
      topic: 'toAdd',
      consumerId: idUiConf!,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idUiConf!)) {
          return;
        }
        dispatch(actions.setFgAdd(true));
      },
    };
    subject.subscribe(toAddObserver);

    const toEditObserver: Observer = {
      topic: 'toEdit',
      consumerId: idUiConf!,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idUiConf!)) {
          return;
        }
        dispatch(actions.setFgAdd(false));
      },
    };
    subject.subscribe(toEditObserver);

    //销毁观察者
    return () => {
      subject.unsubsribe(toAddObserver);
      subject.unsubsribe(toEditObserver);
    };
  }, []);

  const handleSave = () => {
    if (fgAdd) {
      subject.publish({
        topic: 'add',
        producerId: idUiConf!,
        data: undefined,
      });
    } else {
      subject.publish({
        topic: 'edit',
        producerId: idUiConf!,
        data: undefined,
      });
    }
  };

  const handleAddAgain = () => {
    subject.publish({
      topic: 'addAgain',
      producerId: idUiConf!,
      data: undefined,
    });
  };

  const handleCancel = () => {
    subject.publish({
      topic: 'cancel',
      producerId: idUiConf!,
      data: undefined,
    });
  };

  const handleReflesh = () => {
    subject.publish({
      topic: 'detailReflesh',
      producerId: idUiConf!,
      data: undefined,
    });
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: '0 1 auto',
          gap: actionFormConf?.gap ?? '10px',
          justifyContent: actionFormConf?.justifyContent ?? 'start',
          flexWrap: 'wrap',
        }}
      >
        <Button
          key={'ueHq5gJXKio3jiy5P-bcI'}
          size={'middle'}
          type={'primary'}
          onClick={handleSave}
        >
          {'保存'}
        </Button>
        <Button
          key={'DU4_-4ekx5Jc-Z5BmIPxD'}
          size={'middle'}
          type={'primary'}
          onClick={handleAddAgain}
          hidden={!fgAdd}
        >
          {'保存并新增'}
        </Button>
        <Button
          key={'9TxQkPfN6Xyukc1lyD9_u'}
          size={'middle'}
          type={'primary'}
          onClick={handleCancel}
        >
          {'取消'}
        </Button>
        <Button
          key={'4Sjb4fJ21fhztQMH3JuQt'}
          size={'middle'}
          type={'primary'}
          onClick={handleReflesh}
          hidden={fgAdd}
        >
          {'刷新'}
        </Button>
      </div>
    </>
  );
};

export default FromToolBarComponent;

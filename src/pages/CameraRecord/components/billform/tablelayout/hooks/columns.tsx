import { Checkbox, Dropdown, Menu, TableColumnType, message } from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { EPartName } from '@/models';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
import CustomDateText from '@/components/CustomDateText';
import { TCameraRecord } from '../../../../models';
export const useMainTableColumns: () => TableColumnType<TCameraRecord>[] =
  () => {
    const dispatch = useDispatch();
    const toEdit = () => {
      message.error('to be complate');
    };

    const detail = () => {
      message.error('to be complate');
    };

    const remove = () => {
      message.error('to be complate');
    };

    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={toEdit}>
          编辑
        </Menu.Item>
        <Menu.Item key="2" onClick={detail}>
          详情
        </Menu.Item>
        <Menu.Item key="3" onClick={remove}>
          删除
        </Menu.Item>
      </Menu>
    );

    const timeDisplay = (durationSec: number) => {
      durationSec = Math.floor(durationSec);
      if (durationSec >= 1 * 60 * 60) {
        const hour = Math.floor(durationSec / (60 * 60));
        const m = Math.floor((durationSec % (60 * 60)) / 60);
        const s = (durationSec % (60 * 60)) % 60;
        return `${hour}h ${m}m ${s}s`;
      } else if (durationSec >= 60) {
        const m = Math.floor((durationSec % (60 * 60)) / 60);
        const s = (durationSec % (60 * 60)) % 60;
        return `${m}m ${s}s`;
      } else {
        const s = durationSec;
        return `00m ${s}s`;
      }
    };

    return [
      {
        width: 150,
        title: '记录id',
        dataIndex: 'idCameraRecord',
        key: 'idCameraRecord',
        render: (_dom: any, record: any) => {
          return <>{record.idCameraRecord ? record.idCameraRecord : '--'}</>;
        },
      },
      {
        width: 150,
        title: '文件名称',
        dataIndex: 'fileName',
        key: 'fileName',
        render: (_dom: any, record: any) => {
          return <>{record.fileName ? record.fileName : '--'}</>;
        },
      },
      {
        width: 150,
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (_dom: any, record: any) => {
          return (
            <>
              <CustomDateText
                value={record.startTime}
                format="YYYY-MM-DDTHH:mm:ssZ"
                displayFormat="YYYY-MM-DD HH:mm:ss"
              />
            </>
          );
        },
      },
      {
        width: 150,
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render: (_dom: any, record: any) => {
          return (
            <>
              <CustomDateText
                value={record.endTime}
                format="YYYY-MM-DDTHH:mm:ssZ"
                displayFormat="YYYY-MM-DD HH:mm:ss"
              />
            </>
          );
        },
      },
      {
        width: 150,
        title: '临时文件标志',
        dataIndex: 'fgTemp',
        key: 'fgTemp',
        render: (_dom: any, record: any) => {
          return (
            <>
              <Checkbox checked={record.fgTemp ?? false} />
            </>
          );
        },
      },
      {
        width: 150,
        title: '文件时长',
        dataIndex: 'duration',
        key: 'duration',
        render: (_dom: any, record: any) => {
          return (
            <>{record.duration ? timeDisplay(record.duration / 1000) : '--'}</>
          );
        },
      },
      {
        width: 150,
        title: '是否有音频',
        dataIndex: 'hasAudio',
        key: 'hasAudio',
        render: (_dom: any, record: any) => {
          return (
            <>
              <Checkbox checked={record.hasAudio ?? false} />
            </>
          );
        },
      },
      {
        width: 150,
        title: '摄像头',
        dataIndex: ['idCamera', 'camera'],
        key: 'idCamera',
        render: (_dom: any, record: any) => {
          const refConf = getRefByAttr(
            EPartName.Header,
            'cameraRecord',
            'idCamera',
            billformConf!,
          );
          if (refConf) {
            const refData = (record as any).camera;
            if (refData) {
              return refData[refConf.displayProp!];
            }
          }
        },
      },
      {
        width: 150,
        title: '创建时间',
        dataIndex: 'created',
        key: 'created',
        render: (_dom: any, record: any) => {
          return (
            <>
              <CustomDateText
                value={record.created}
                format="YYYY-MM-DDTHH:mm:ssZ"
                displayFormat="YYYY-MM-DD HH:mm:ss"
              />
            </>
          );
        },
      },
      {
        width: 150,
        title: '文件删除标志',
        dataIndex: 'fgRemove',
        key: 'fgRemove',
        render: (_dom: any, record: any) => {
          return (
            <>
              <Checkbox checked={record.fgRemove ?? false} />
            </>
          );
        },
      },
      {
        width: 150,
        title: '临时文件名称',
        dataIndex: 'tempFileName',
        key: 'tempFileName',
        render: (_dom: any, record: any) => {
          return <>{record.tempFileName ? record.tempFileName : '--'}</>;
        },
      },
    ];
  };

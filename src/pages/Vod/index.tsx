import { FC, useEffect, useRef, useState } from 'react';
import { Button, Table, TableColumnType } from 'antd';
import CustomDateText from '@/components/CustomDateText';
import PlayerButton from './PlayerButton';
import BaseAPI from '@/api';
import moment,{Moment} from 'moment';

// 记录
type RecordFileInfo = {
  // 文件名称
  fileName: string;
  // 文件大小
  size: number;
  // 最后修改时间
  modTime: Date;
};

const Vod: FC = () => {
  const [tableData, setTableData] = useState<RecordFileInfo[]>([]);

  useEffect(() => {
    handleReflush();
  }, []);

  const handleReflush = async () => {
    const tableData: RecordFileInfo[] = await BaseAPI.GET('/vod/getFileList');
    const tableDataSort = tableData
      // .sort((pre: RecordFileInfo, next: RecordFileInfo) => {
      //   return pre.fileName.localeCompare(next.fileName);
      // })
      .sort((pre: RecordFileInfo, next: RecordFileInfo) => {
        return moment(next.modTime).valueOf() - moment(pre.modTime).valueOf();
      });
    setTableData(tableDataSort);
  };

  const columns: TableColumnType<RecordFileInfo>[] = [
    {
      width: 150,
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (_dom: any, record: RecordFileInfo) => {
        return <>{record.fileName ? record.fileName : '--'}</>;
      },
    },
    {
      width: 150,
      title: '最后修改时间',
      dataIndex: 'modTime',
      key: 'modTime',
      render: (_dom: any, record: RecordFileInfo) => {
        return (
          <>
            <CustomDateText
              value={record.modTime}
              format="YYYY-MM-DDTHH:mm:ssZ"
              displayFormat="YYYY-MM-DD HH:mm:ss"
            />
          </>
        );
      },
    },
    {
      width: 150,
      title: '文件大小',
      dataIndex: 'size',
      key: 'size',
      render: (_dom: any, record: RecordFileInfo) => {
        let sizeStr = '--';
        if (record.size > 1024 * 1024 * 1024) {
          const size = (record.size / (1024 * 1024 * 1024)).toFixed(2);
          sizeStr = `${size}G`;
        } else if (record.size > 1024 * 1024) {
          const size = (record.size / (1024 * 1024)).toFixed(2);
          sizeStr = `${size}M`;
        } else if (record.size > 1024) {
          const size = (record.size / 1024).toFixed(2);
          sizeStr = `${size}k`;
        } else {
          const size = record.size.toFixed(2);
          sizeStr = `${size}k`;
        }
        return <>{sizeStr}</>;
      },
    },
    {
      width: 100,
      fixed: 'right',
      title: '操作',
      key: 'action',
      sorter: true,
      render: (_dom: any, record: RecordFileInfo) => {
        const getVodInfo = () => {
          return { fileName: record.fileName };
        };
        return (
          <div>
            <PlayerButton disabled={!record.fileName} getVodInfo={getVodInfo} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 'auto',
          gap: '20px',
          margin: '10px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button onClick={handleReflush}>刷新</Button>
        </div>
        <div>
          <Table
            size={'small'}
            rowKey={'fileName'}
            columns={columns}
            dataSource={tableData}
            scroll={{ x: 300, y: 800 }}
            pagination={{
              total: tableData.length,
              pageSize: 20,
              showTotal: (total: number) => {
                return <>总数：{total}</>;
              },
            }}
          />
        </div>
      </div>
    </>
  );
};
export default Vod;

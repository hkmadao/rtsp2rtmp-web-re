import { FC, useEffect, useRef, useState } from 'react';
import { Button, Table, TableColumnType } from 'antd';
import CustomDateText from '@/components/CustomDateText';
import BaseAPI from '@/api';
import moment, { Moment } from 'moment';
import Vod from './Vod';

// 记录
type RecordFileInfo = {
  // 文件名称
  fileName: string;
  // 文件大小
  size: number;
  // 最后修改时间
  modTime: string;
};

const HistoryVedio: FC = () => {
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
        return (
          <div>
            <Vod disabled={false} fileName={record.fileName} />
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
          height: 'calc(100vh - 56px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 'auto',
            gap: '20px',
            margin: '10px',
            overflow: 'auto',
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
              scroll={{ x: 300, y: 600 }}
              rowSelection={{
                type: 'radio',
              }}
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
      </div>
    </>
  );
};
export default HistoryVedio;

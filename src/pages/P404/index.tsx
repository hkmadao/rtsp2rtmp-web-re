import React from 'react';
import { FrownOutlined } from '@ant-design/icons';
import styles from './404.less';

const Error = () => (
  <div>
    <div className={styles.error}>
      <FrownOutlined />
      <h1>404 Not Found</h1>
    </div>
  </div>
);

export default Error;

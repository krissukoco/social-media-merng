import { useState } from 'react';

import styles from '../../styles/Tooltip.module.css';

const TooltipContent = () => {
  return (
    <div className={styles.content}>
      <p>Password should match the followings:</p>
      <ul style={{ listStyle: 'square' }}>
        <li>
          Has <b>8 characters</b> or more
        </li>
        <li>
          At least 1 <b>UPPERCASE</b> letter and 1 <b>lowercase</b> letter
        </li>
        <li>
          Contains at least <b>1 number</b> (0 to 9)
        </li>
        <li>
          Contains at least 1 of these: <b> @ $ ! % * ? & </b>
        </li>
      </ul>
    </div>
  );
};

const PasswordTooltip = ({ style }) => {
  return (
    <div className={styles.tooltipContainer} style={style}>
      <div className={styles.tooltip}>
        <TooltipContent />
      </div>
    </div>
  );
};

export default PasswordTooltip;

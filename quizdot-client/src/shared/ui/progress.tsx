/* eslint-disable prettier/prettier */
import ProgressBar from '@ramonak/react-progress-bar';
import { useEffect, useState } from 'react';

interface ProgressProps {
  className: string;
  currentValue: string;
  maxValue: number;
  label: string;
}

export function Progress(props: ProgressProps) {
  const [currentValue, setCurrentValue] = useState(props.currentValue);

  useEffect(() => {
    setCurrentValue(props.currentValue);
  }, [currentValue]);

  return (
    <div className="">
      <ProgressBar
        className={`rounded-md border-2 shadow-md ${props.className}`}
        completed={currentValue}
        maxCompleted={props.maxValue}
        borderRadius="0px"
        isLabelVisible={false}
        baseBgColor="white"
        bgColor="grey"
      />
      <div className="">{props.label}</div>
    </div>
  );
}

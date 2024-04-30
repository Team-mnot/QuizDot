import ProgressBar from '@ramonak/react-progress-bar';

interface ProgressProps {
  padding: string;
  size: string;
  label: string;
  color: string;
  currentValue: number;
  maxValue: number;
}

export function Progress(props: ProgressProps) {
  return (
    <div>
      <div className={`relative ${props.padding} ${props.size}`}>
        <p className={'absolute w-full text-center'}>{props.label}</p>
        <ProgressBar
          className={'rounded-md border-2 shadow-md '}
          completed={`${props.currentValue}`}
          maxCompleted={props.maxValue}
          borderRadius="5px"
          isLabelVisible={false}
          baseBgColor="white"
          bgColor={props.color}
        />
      </div>
    </div>
  );
}

import { LogOutButton } from '@/shared/components/index';

export function ChannelHeader() {
  return (
    <div className={'absolute left-[0px] top-[0px] w-full px-[50px] py-[20px]'}>
      <div className="flex justify-end">
        <LogOutButton />
      </div>
      <div className="text-center">
        <h1>채널</h1>
      </div>
    </div>
  );
}

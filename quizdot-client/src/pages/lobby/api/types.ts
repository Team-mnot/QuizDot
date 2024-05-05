export interface RoomInfo {
  id: number;
  title: string;
  public: boolean;
  password: string;
  mode: string;
  maxPeople: number;
  category: string;
  maxQuestion: number;
}

export interface RoomInfoProps {
  title: string;
  public: boolean;
  password: string;
  mode: string;
  maxPeople: number;
  category: string;
  maxQuestion: number;
}

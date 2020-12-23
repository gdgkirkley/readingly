import { useState } from "react";

const useToggle = (initialState: boolean): [boolean, () => void] => {
  const [toggled, setToggled] = useState<boolean>(initialState);

  const toggle = () => setToggled(!toggled);

  return [toggled, toggle];
};

export default useToggle;

import React from "react";
import styled from "styled-components";
import { GlobeIcon, FriendsIcon, LockIcon } from "./icons/Privacy";

type Props = {
  privacyLevel: string;
  size?: "small" | "medium" | "large";
  align?: "left" | "center" | "right";
};

type StyleProps = {
  size: "small" | "medium" | "large";
  align: "left" | "center" | "right";
};

const PrivacyStyle = styled.div<StyleProps>`
  display: flex;
  background: #c3e9ff;
  color: #074468;
  font-weight: 600;
  font-size: 1.5rem;
  min-width: 9.5rem;
  border-radius: 1000px;
  justify-self: ${(props) =>
    props.align === "center"
      ? "center"
      : props.align === "left"
      ? "flex-start"
      : "flex-end"};
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 1rem;
  margin: 1rem 0;
  & svg {
    color: #074468;
    width: ${(props) =>
      props.size === "small"
        ? "1.5rem"
        : props.size === "medium"
        ? "2rem"
        : "2.5rem"};
  }
`;

const PrivacyIndicator: React.FC<Props> = ({
  privacyLevel,
  size = "small",
  align = "left",
}: Props) => {
  const getIcon = (): JSX.Element => {
    switch (privacyLevel) {
      case "Private":
        return <LockIcon />;
      case "Friends":
        return <FriendsIcon />;
      case "Public":
        return <GlobeIcon />;
      default:
        null;
    }
  };

  return (
    <PrivacyStyle size={size} align={align}>
      {getIcon()}
      {privacyLevel}
    </PrivacyStyle>
  );
};

export default PrivacyIndicator;

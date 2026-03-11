import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  disabled?: boolean;
}

export default function PrimaryButton({
  title,
  disabled = false,
  ...props
}: PrimaryButtonProps) {
  // 버튼이 비활성화 상태일 때와 활성화 상태일 때의 스타일을 명확하게 분리합니다.
  const baseStyle = "h-16 rounded-2xl justify-center items-center shadow-md";
  const activeStyle = "bg-blue-500 shadow-blue-500/30";
  const disabledStyle = "bg-gray-400 shadow-none";

  const buttonStyle = `${baseStyle} ${disabled ? disabledStyle : activeStyle}`;

  return (
    <TouchableOpacity className={buttonStyle} disabled={disabled} {...props}>
      <Text className="text-white text-lg font-semibold">{title}</Text>
    </TouchableOpacity>
  );
}

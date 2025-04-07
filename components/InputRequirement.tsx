import React from 'react';
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

export default function InputRequirement({ isInputEmpty, requirement, text }: {
  isInputEmpty: boolean,
  requirement: boolean,
  text: string
}) {
  return (
    <p className={`${isInputEmpty && 'text-gray-300'} text-sm`}>
      {requirement
        ? <FaCheck className={`${isInputEmpty ? 'text-inherit' : 'text-green-500'} inline mr-2`} />
        : <FaXmark className={`${isInputEmpty ? 'text-inherit' : 'text-red-500'} inline mr-2`} />
      }
      {text}
    </p>
  )
}

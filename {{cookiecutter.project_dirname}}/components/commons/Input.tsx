import React from 'react'
import styled from 'styled-components'

type Props = JSX.IntrinsicElements['input'] & {
  errors?: string[]
}

const InputWithErrors = ({
  errors,
  max,
  min,
  onChange,
  placeholder,
  required,
  step,
  style,
  type,
  value
}: Props) => {
  return (
    <InputContainer style={style}>
      <Input
        errors={errors && errors.length > 0}
        max={max}
        min={min}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={step}
        type={type}
        value={value}
      />
      {errors && errors.length > 0 && errors.map(err => <p key={err}>{err}</p>)}
    </InputContainer>
  )
}

const Input = styled.input<{ errors?: boolean }>`
  border: 1px solid black;
  box-sizing: border-box;
  border-radius: 6px;
  padding: 10px 20px;
  font-style: normal;
  font-size: 16px;
  line-height: 19px;
  ::placeholder {
    font-style: italic;
  }
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  p {
    font-size: 12px;
    margin-left: 10px;
    color: ${({ theme }) => theme.colors.status.error};
  }
`

export { Input, InputWithErrors }

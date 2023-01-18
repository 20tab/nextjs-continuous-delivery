import styled from 'styled-components'

type Props = {
  ui: 'primary' | 'secondary'
}

export const Button = styled.button<Props>`
  align-items: center;
  background-color: ${({ theme, ui }) => theme.colors[ui]};
  border: 0;
  border-radius: 5px;
  color: gray;
  cursor: pointer;
  display: flex;
  justify-content: center;
  min-width: 120px;
  outline: none;
  padding: 10px;
  transition: 0.3s background-color ease-in-out;
  width: fit-content;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
  &:hover {
  }
`

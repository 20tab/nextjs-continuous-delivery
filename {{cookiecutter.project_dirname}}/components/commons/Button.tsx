import styled from 'styled-components'

export const Button = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.link};
  border: 0;
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.ui1};
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
    background-color: ${({ theme }) => theme.colors.activeLink};
  }
`

import styled from 'styled-components'

type BaseTextProps = {
  color?: string
  italic?: boolean
  margin?: string
  uppercase?: boolean
  weight?: 'bold' | 'normal'
}

export const MainTitle = styled.h1<BaseTextProps>`
  color: ${({ color }) => color};
  font-size: 36px;
  font-weight: ${({ weight }) => weight || 'normal'};
  margin: ${({ margin }) => margin || 0};
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'none')};
  ${({ italic }) => italic && 'font-style: italic;'};
`

export const Title = styled.h2<BaseTextProps>`
  color: ${({ color }) => color};
  font-size: 24px;
  font-weight: ${({ weight }) => weight || 'normal'};
  margin: ${({ margin }) => margin || 0};
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'none')};
  ${({ italic }) => italic && 'font-style: italic;'};
`

export const SubTitle = styled.h3<BaseTextProps>`
  color: ${({ color }) => color};
  font-size: 20px;
  font-weight: ${({ weight }) => weight || 'normal'};
  margin: ${({ margin }) => margin || 0};
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'none')};
  ${({ italic }) => italic && 'font-style: italic;'};
`

export const Text = styled.p<BaseTextProps>`
  color: ${({ color }) => color};
  font-size: 16px;
  font-weight: ${({ weight }) => weight || 'normal'};
  margin: ${({ margin }) => margin || 0};
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'none')};
  ${({ italic }) => italic && 'font-style: italic;'};
`

export const Small = styled(Text)<BaseTextProps>`
  font-size: 14px;
`

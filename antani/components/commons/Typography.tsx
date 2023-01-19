import styled from 'styled-components'

type BaseTextProps = {
  color?: string
  italic?: boolean
  margin?: string
  uppercase?: boolean
  weight?: 'bold' | 'normal'
}

const GenericTitle = styled.h1<BaseTextProps>`
  color: ${({ color }) => color};
  margin: ${({ margin }) => margin || 0};
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'none')};
  ${({ italic }) => italic && 'font-style: italic;'};
`

export const H1 = {
  Normal: styled(GenericTitle)`
    font-size: ${({ theme }) => theme.titles.h1.normal.fontSize};
    font-weight: ${({ theme }) => theme.titles.h1.normal.fontWeight};
  `,
  Big: styled(GenericTitle)`
    font-size: ${({ theme }) => theme.titles.h1.big.fontSize};
    font-weight: ${({ theme }) => theme.titles.h1.big.fontWeight};
  `,
  Medium: styled(GenericTitle)`
    font-size: ${({ theme }) => theme.titles.h1.medium.fontSize};
    font-weight: ${({ theme }) => theme.titles.h1.medium.fontWeight};
  `
}

export const H2 = {
  Normal: styled(GenericTitle).attrs({ as: 'h2' })`
    font-size: ${({ theme }) => theme.titles.h2.normal.fontSize};
    font-weight: ${({ theme }) => theme.titles.h2.normal.fontWeight};
  `
}

export const H3 = {
  Normal: styled(GenericTitle).attrs({ as: 'h3' })`
    font-size: ${({ theme }) => theme.titles.h3.normal.fontSize};
    font-weight: ${({ theme }) => theme.titles.h3.normal.fontWeight};
  `
}

export const H4 = {
  Normal: styled(GenericTitle).attrs({ as: 'h4' })`
    font-size: ${({ theme }) => theme.titles.h4.normal.fontSize};
    font-weight: ${({ theme }) => theme.titles.h4.normal.fontWeight};
  `
}

const GenericText = styled.p<BaseTextProps>`
  color: ${({ color, theme }) => color || theme.colors.ui8};
  margin: ${({ margin }) => margin || 0};
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'none')};
  ${({ italic }) => italic && 'font-style: italic;'};
`

export const Text = {
  Normal: styled(GenericText)`
    font-size: ${({ theme }) => theme.texts.normal.fontSize};
    font-weight: ${({ theme }) => theme.texts.normal.fontWeight};
  `,
  NormalBold: styled(GenericText)`
    font-size: ${({ theme }) => theme.texts.normalBold.fontSize};
    font-weight: ${({ theme }) => theme.texts.normalBold.fontWeight};
  `,
  Big: styled(GenericText)`
    font-size: ${({ theme }) => theme.texts.big.fontSize};
    font-weight: ${({ theme }) => theme.texts.big.fontWeight};
  `,
  BigBold: styled(GenericText)`
    font-size: ${({ theme }) => theme.texts.bigBold.fontSize};
    font-weight: ${({ theme }) => theme.texts.bigBold.fontWeight};
  `,
  Medium: styled(GenericText)`
    font-size: ${({ theme }) => theme.texts.medium.fontSize};
    font-weight: ${({ theme }) => theme.texts.medium.fontWeight};
  `,
  MediumBold: styled(GenericText)`
    font-size: ${({ theme }) => theme.texts.mediumBold.fontSize};
    font-weight: ${({ theme }) => theme.texts.mediumBold.fontWeight};
  `,
  Small: styled(GenericText)`
    font-size: ${({ theme }) => theme.texts.small.fontSize};
    font-weight: ${({ theme }) => theme.texts.small.fontWeight};
  `,
  SmallBold: styled(GenericText)`
    font-size: ${({ theme }) => theme.texts.smallBold.fontSize};
    font-weight: ${({ theme }) => theme.texts.smallBold.fontWeight};
  `
}

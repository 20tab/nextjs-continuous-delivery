import '@testing-library/jest-dom/extend-expect'
import { screen } from '@testing-library/react'
import React from 'react'

import { renderWithReduxAndTheme } from '@/__tests__/functions'
import {
  MainTitle,
  Title,
  SubTitle,
  Text,
  Small
} from '@/components/commons/Typography'

const setup = () =>
  renderWithReduxAndTheme(
    <>
      <MainTitle>MainTitle</MainTitle>
      <MainTitle uppercase italic>
        StyledMainTitle
      </MainTitle>
      <Title>Title</Title>
      <Title uppercase italic>
        StyledTitle
      </Title>
      <SubTitle>SubTitle</SubTitle>
      <SubTitle uppercase italic>
        StyledSubTitle
      </SubTitle>
      <Text>Text</Text>
      <Text uppercase italic>
        StyledText
      </Text>
      <Small>Small</Small>
      <Small uppercase italic>
        StyledSmall
      </Small>
    </>
  )

test('Typography renders correctly', () => {
  setup()
  const mainTitle = screen.getByText('MainTitle')
  expect(mainTitle.innerHTML).toEqual('MainTitle')
  const styledMainTitle = screen.getByText('StyledMainTitle')
  expect(styledMainTitle).toHaveStyle(
    'text-transform: uppercase; font-style: italic'
  )

  const title = screen.getByText('Title')
  expect(title.innerHTML).toEqual('Title')
  const styledTitle = screen.getByText('StyledTitle')
  expect(styledTitle).toHaveStyle(
    'text-transform: uppercase; font-style: italic'
  )

  const subTitle = screen.getByText('SubTitle')
  expect(subTitle.innerHTML).toEqual('SubTitle')
  const styledSubTitle = screen.getByText('StyledSubTitle')
  expect(styledSubTitle).toHaveStyle(
    'text-transform: uppercase; font-style: italic'
  )

  const text = screen.getByText('Text')
  expect(text.innerHTML).toEqual('Text')
  const styledText = screen.getByText('StyledText')
  expect(styledText).toHaveStyle(
    'text-transform: uppercase; font-style: italic'
  )

  const small = screen.getByText('Small')
  expect(small.innerHTML).toEqual('Small')
  const styledSmall = screen.getByText('StyledSmall')
  expect(styledSmall).toHaveStyle(
    'text-transform: uppercase; font-style: italic'
  )
})

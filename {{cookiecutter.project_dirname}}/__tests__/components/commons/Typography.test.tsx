import { expect } from '@jest/globals'
import { screen } from '@testing-library/react'
import React from 'react'

import { H1, H2, H3, H4, Text } from '@/components/commons/Typography'

import { renderWithWrappers } from '@/__tests__/functions'

describe('Titles', () => {
  describe('H1', () => {
    it('Normal H1 renders correctly', () => {
      renderWithWrappers(<H1.Normal>MainTitle</H1.Normal>)
      screen.getByText('MainTitle')
    })
    it('Normal H1 renders correctly with style props', () => {
      renderWithWrappers(
        <H1.Normal $uppercase $italic color='red'>
          MainTitle
        </H1.Normal>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainTitle')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('500')
      expect(compiledMainTitle.fontSize).toBe('40px')
    })
    it('Big H1 renders correctly', () => {
      renderWithWrappers(<H1.Big>MainTitle</H1.Big>)
      screen.getByText('MainTitle')
    })
    it('Big H1 renders correctly with style props', () => {
      renderWithWrappers(
        <H1.Big $uppercase $italic color='red'>
          MainTitle
        </H1.Big>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainTitle')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('500')
      expect(compiledMainTitle.fontSize).toBe('50px')
    })
    it('Medium H1 renders correctly', () => {
      renderWithWrappers(<H1.Medium>MainTitle</H1.Medium>)
      screen.getByText('MainTitle')
    })
    it('Medium H1 renders correctly with style props', () => {
      renderWithWrappers(
        <H1.Medium $uppercase $italic color='red'>
          MainTitle
        </H1.Medium>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainTitle')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('500')
      expect(compiledMainTitle.fontSize).toBe('45px')
    })
  })
  describe('H2', () => {
    it('Normal H2 renders correctly', () => {
      renderWithWrappers(<H2.Normal>MainTitle</H2.Normal>)
      screen.getByText('MainTitle')
    })
    it('Normal H2 renders correctly with style props', () => {
      renderWithWrappers(
        <H2.Normal $uppercase $italic color='red'>
          MainTitle
        </H2.Normal>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainTitle')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('500')
      expect(compiledMainTitle.fontSize).toBe('32px')
    })
  })
  describe('H3', () => {
    it('H3 renders correctly', () => {
      renderWithWrappers(<H3.Normal>MainTitle</H3.Normal>)
      screen.getByText('MainTitle')
    })
    it('H3 renders correctly with style props', () => {
      renderWithWrappers(
        <H3.Normal $uppercase $italic color='red'>
          MainTitle
        </H3.Normal>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainTitle')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('500')
      expect(compiledMainTitle.fontSize).toBe('24px')
    })
  })
  describe('H4', () => {
    it('H4 renders correctly', () => {
      renderWithWrappers(<H4.Normal>MainTitle</H4.Normal>)
      screen.getByText('MainTitle')
    })
    it('H4 renders correctly with style props', () => {
      renderWithWrappers(
        <H4.Normal $uppercase $italic color='red'>
          MainTitle
        </H4.Normal>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainTitle')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('500')
      expect(compiledMainTitle.fontSize).toBe('20px')
    })
  })
})

describe('Text', () => {
  describe('Normal', () => {
    it('Normal Text renders correctly', () => {
      renderWithWrappers(<Text.Normal>MainParagraph</Text.Normal>)
      screen.getByText('MainParagraph')
    })
    it('Normal Text renders correctly with style props', () => {
      renderWithWrappers(
        <Text.Normal $uppercase $italic color='red'>
          MainParagraph
        </Text.Normal>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainParagraph')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('400')
      expect(compiledMainTitle.fontSize).toBe('16px')

      expect(compiledMainTitle.fontSize).toBe('16px')
    })
    it('NormalBold Text renders correctly', () => {
      renderWithWrappers(<Text.NormalBold>MainParagraph</Text.NormalBold>)
      screen.getByText('MainParagraph')
    })
    it('NormalBold Text renders correctly with style props', () => {
      renderWithWrappers(
        <Text.NormalBold $uppercase $italic color='red'>
          MainParagraph
        </Text.NormalBold>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainParagraph')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('700')
      expect(compiledMainTitle.fontSize).toBe('16px')
    })
  })
  describe('Small', () => {
    it('Small Text renders correctly', () => {
      renderWithWrappers(<Text.Small>MainParagraph</Text.Small>)
      screen.getByText('MainParagraph')
    })
    it('Small Text renders correctly with style props', () => {
      renderWithWrappers(
        <Text.Small $uppercase $italic color='red'>
          MainParagraph
        </Text.Small>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainParagraph')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('400')
      expect(compiledMainTitle.fontSize).toBe('10px')
    })
    it('SmallBold Text renders correctly', () => {
      renderWithWrappers(<Text.SmallBold>MainParagraph</Text.SmallBold>)
      screen.getByText('MainParagraph')
    })
    it('SmallBold Text renders correctly with style props', () => {
      renderWithWrappers(
        <Text.SmallBold $uppercase $italic color='red'>
          MainParagraph
        </Text.SmallBold>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainParagraph')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('500')
      expect(compiledMainTitle.fontSize).toBe('10px')
    })
  })
  describe('Medium', () => {
    it('Medium Text renders correctly', () => {
      renderWithWrappers(<Text.Medium>MainParagraph</Text.Medium>)
      screen.getByText('MainParagraph')
    })
    it('Medium Text renders correctly with style props', () => {
      renderWithWrappers(
        <Text.Medium $uppercase $italic color='red'>
          MainParagraph
        </Text.Medium>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainParagraph')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('400')
      expect(compiledMainTitle.fontSize).toBe('12px')
    })
    it('MediumBold Text renders correctly', () => {
      renderWithWrappers(<Text.MediumBold>MainParagraph</Text.MediumBold>)
      screen.getByText('MainParagraph')
    })
    it('MediumBold Text renders correctly with style props', () => {
      renderWithWrappers(
        <Text.MediumBold $uppercase $italic color='red'>
          MainParagraph
        </Text.MediumBold>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainParagraph')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('700')
      expect(compiledMainTitle.fontSize).toBe('12px')
    })
  })
  describe('Big', () => {
    it('Big Text renders correctly', () => {
      renderWithWrappers(<Text.Big>MainParagraph</Text.Big>)
      screen.getByText('MainParagraph')
    })
    it('Big Text renders correctly with style props', () => {
      renderWithWrappers(
        <Text.Big $uppercase $italic color='red'>
          MainParagraph
        </Text.Big>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainParagraph')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('400')
      expect(compiledMainTitle.fontSize).toBe('18px')
    })
    it('BigBold Text renders correctly', () => {
      renderWithWrappers(<Text.BigBold>MainParagraph</Text.BigBold>)
      screen.getByText('MainParagraph')
    })
    it('BigBold Text renders correctly with style props', () => {
      renderWithWrappers(
        <Text.BigBold $uppercase $italic color='red'>
          MainParagraph
        </Text.BigBold>
      )
      const compiledMainTitle = window.getComputedStyle(
        screen.getByText('MainParagraph')
      )
      expect(compiledMainTitle.textTransform).toBe('uppercase')
      expect(compiledMainTitle.fontStyle).toBe('italic')
      expect(compiledMainTitle.color).toBe('red')
      expect(compiledMainTitle.fontWeight).toBe('700')
      expect(compiledMainTitle.fontSize).toBe('18px')
    })
  })
})

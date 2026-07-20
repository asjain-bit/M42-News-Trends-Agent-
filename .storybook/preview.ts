import type { Preview } from '@storybook/react'
import React from 'react'
import '../src/app/globals.css'
import { ThemeProvider } from '../src/contexts/ThemeContext'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="p-4 bg-bg-default text-text-primary min-h-[100px]">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}

export default preview

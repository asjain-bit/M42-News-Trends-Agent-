import fs from 'fs';
import path from 'path';

const components = {
  atoms: ['Button', 'Input', 'Textarea', 'Select', 'Badge', 'Spinner', 'Avatar', 'ThemeToggle', 'Icon'],
  molecules: ['FormField', 'SearchBar', 'Toast', 'AppDialog', 'KPICard'],
  organisms: ['SiteHeader', 'DataTable', 'SettingsPanel'],
  templates: ['AppShell']
};

const srcDir = path.join(process.cwd(), 'src', 'components');

for (const [layer, names] of Object.entries(components)) {
  for (const name of names) {
    const dir = path.join(srcDir, layer, name);
    fs.mkdirSync(dir, { recursive: true });

    // Component file
    fs.writeFileSync(path.join(dir, `${name}.tsx`), `/**
 * ${name} - ${layer.charAt(0).toUpperCase() + layer.slice(1, -1)}
 * One-line description.
 * Used in: TBD
 */
import React from 'react';
import type { ${name}Props } from './${name}.types';

export const ${name}: React.FC<${name}Props> = (props) => {
  return (
    <div className="p-4" data-testid="${name}">
      ${name} Component
    </div>
  );
};
`);

    // Types file
    fs.writeFileSync(path.join(dir, `${name}.types.ts`), `export interface ${name}Props {
  // Add props here
}
`);

    // Test file
    fs.writeFileSync(path.join(dir, `${name}.test.tsx`), `import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders correctly', () => {
    render(<${name} />);
    expect(screen.getByTestId('${name}')).toBeInTheDocument();
  });
});
`);

    // Story file
    if (layer !== 'templates') {
      fs.writeFileSync(path.join(dir, `${name}.stories.tsx`), `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta: Meta<typeof ${name}> = {
  title: '${layer.charAt(0).toUpperCase() + layer.slice(1)}/${name}',
  component: ${name},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${name}>;

export const Default: Story = {
  args: {},
};

export const EdgeCases: Story = {
  args: {},
};
`);
    }

    // Index file
    fs.writeFileSync(path.join(dir, `index.ts`), `export { ${name} } from './${name}';
export type { ${name}Props } from './${name}.types';
`);
  }
}

console.log('Components scaffolded successfully.');

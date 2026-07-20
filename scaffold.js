import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const components = [
  { layer: 'atoms', name: 'Button' },
  { layer: 'atoms', name: 'Badge' },
  { layer: 'atoms', name: 'Typography' },
  { layer: 'molecules', name: 'FormField' },
  { layer: 'molecules', name: 'ReportCard' },
  { layer: 'organisms', name: 'Sidebar' },
  { layer: 'organisms', name: 'Topbar' },
  { layer: 'templates', name: 'AuthLayout' },
  { layer: 'templates', name: 'DashboardLayout' }
];

components.forEach(({ layer, name }) => {
  const dir = path.join(__dirname, 'src', 'components', layer, name);
  fs.mkdirSync(dir, { recursive: true });

  const templates = {
    [`${name}.tsx`]: `import React from 'react';\nimport { ${name}Props } from './${name}.types';\n\nexport const ${name}: React.FC<${name}Props> = (props) => {\n  return <div className="">${name}</div>;\n};`,
    [`${name}.types.ts`]: `export interface ${name}Props {\n  // Define props here\n}`,
    [`${name}.test.tsx`]: `import React from 'react';\nimport { render } from '@testing-library/react';\nimport { ${name} } from './${name}';\n\ndescribe('${name}', () => {\n  it('renders correctly', () => {\n    render(<${name} />);\n  });\n});`,
    [`${name}.stories.tsx`]: `import type { Meta, StoryObj } from '@storybook/react';\nimport { ${name} } from './${name}';\n\nconst meta: Meta<typeof ${name}> = {\n  component: ${name},\n};\nexport default meta;\ntype Story = StoryObj<typeof ${name}>;\n\nexport const Default: Story = {};`,
    [`index.ts`]: `export * from './${name}';\nexport * from './${name}.types';`
  };

  for (const [file, content] of Object.entries(templates)) {
    fs.writeFileSync(path.join(dir, file), content);
  }
});

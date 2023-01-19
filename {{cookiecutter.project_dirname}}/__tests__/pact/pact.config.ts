import path from 'path'

import type { JestPactOptionsV3 } from 'jest-pact/dist/v3'

const config: JestPactOptionsV3 = {
  cors: true,
  dir: path.resolve(process.cwd(), './pacts'),
  consumer: '{{ cookiecutter.project_slug }}-{{ cookiecutter.service_slug }}',
  provider: '{{ cookiecutter.project_slug }}-backend'
}

export default config

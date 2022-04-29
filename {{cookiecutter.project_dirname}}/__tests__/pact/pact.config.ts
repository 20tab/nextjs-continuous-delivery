import path from 'path'

const config = {
  cors: true,
  log: path.resolve(process.cwd(), '__tests__/logs', 'pact.log'),
  dir: path.resolve(process.cwd(), './pacts'),
  consumer: '{{ cookiecutter.project_slug }}-{{ cookiecutter.service_slug }}',
  provider: '{{ cookiecutter.project_slug }}-backend'
}

export default config

import path from 'path'

export default {
  cors: true,
  log: path.resolve(process.cwd(), '__tests__/logs', 'pact.log'),
  dir: path.resolve(process.cwd(), '__tests__/pacts'),
  consumer: '{{cookiecutter.project_slug}}-frontend',
  provider: '{{cookiecutter.project_slug}}-backend'
}

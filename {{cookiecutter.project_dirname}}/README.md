This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Git

To get the existing project, change directory, clone the project repository and enter the newly created **{{cookiecutter.project_slug}}** directory:

```bash
git clone GIT_REPOSITORY_URL {{cookiecutter.project_slug}}
cd {{cookiecutter.project_slug}}
```

**NOTE** : Make sure you switch to the correct branch (e.g. `git checkout develop`)
## Getting Started

First, run the development server:

```bash
npm run dev
```
or
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Testing

To run the full test suite, execute:

```bash
npm run test
```
or
```bash
yarn test
```

To run the pact test suite, execute:

```bash
npm run pact
```
or
```bash
yarn pact
```

## Check Linting

To check all file linting, execute:

```bash
npm run eslint
```
or
```bash
yarn eslint
```

## Update package

To update packages, execute:

```bash
yarn upgrade --latest
```

To check audit, execute:

```bash
npm run audit:fix
```
or
```bash
yarn audit:fix
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Data fetching

- [Next.js functions](https://nextjs.org/docs/basic-features/data-fetching) - learn about Next.js functions.

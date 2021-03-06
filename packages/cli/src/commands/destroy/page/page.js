import camelcase from 'camelcase'
import Listr from 'listr'

import { deleteFilesTask, removeRoutesFromRouterTask } from 'src/lib'
import c from 'src/lib/colors'

import { pathName } from '../../generate/helpers'
import { files as pageFiles } from '../../generate/page/page'

export const command = 'page <name> [path]'
export const description = 'Destroy a page and route component'
export const builder = (yargs) => {
  yargs.positional('name', {
    description: 'Name of the page',
    type: 'string',
  })
  yargs.positional('path', {
    description: 'URL path to the page. Defaults to name',
    type: 'string',
  })
}

export const tasks = ({ name, path }) =>
  new Listr(
    [
      {
        title: 'Destroying page files...',
        task: async () => {
          const f = pageFiles({ name, path: pathName(path, name) })
          return deleteFilesTask(f)
        },
      },
      {
        title: 'Cleaning up routes file...',
        task: async () => removeRoutesFromRouterTask([camelcase(name)]),
      },
    ],
    { collapse: false, exitOnError: true }
  )

export const handler = async ({ name, path }) => {
  const t = tasks({ name, path })
  try {
    await t.run()
  } catch (e) {
    console.log(c.error(e.message))
  }
}

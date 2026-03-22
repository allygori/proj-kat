import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import path from 'path'

console.log({
  __dirname: __dirname,
      baseDir: path.resolve(__dirname, './app/(payload)/dashboard'),
      importMapFile: path.resolve(
        __dirname,
        './app/(payload)/dashboard/importMap.js',
      ),

})

export default buildConfig({
  // admin: {
  //   components: {
  //     views: {
  //       dashboard: {
  //         Component: "app/(dashboard)/dashboard/page",
  //         path: "/dashboard",
  //       }
  //     }
  //   }
  // },

  routes: {
    admin: "/dashboard",
  },

  admin: {
    importMap: {
      baseDir: path.resolve(__dirname, './app/(payload)/dashboard'),
      importMapFile: path.resolve(
        __dirname,
        './app/(payload)/dashboard/importMap.js',
      ),
    },
  },

  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections: [],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
})
// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path'
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: false },
  telemetry: false,
  runtimeConfig:{
    public:{
      resourcesDir: path.resolve(__dirname, 'resources')
    }
  }
  
})

import fastify from 'fastify'
import { appRoutes } from './http/routes/index'
import { ZodError } from 'zod'
import { env } from './env'


//PLUGINS
import fastifyRedis from '@fastify/redis'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import { JwtNotDefinedError } from './use-cases/errors/jwt-not-defined-error'

export const app = fastify()

if (!process.env.JWT_SECRET) {
  throw new JwtNotDefinedError()
}

app.register(fastifyCookie)

app.register(fastifyJwt, {

  secret: process.env.JWT_SECRET,
  cookie: {

    cookieName: 'token',
    signed: false


  }

})

app.register(fastifyCors, {

  origin: true,
  credentials: true

})

app.register(fastifyRedis, {

  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379", 10)

})



app.register(appRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelix/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})

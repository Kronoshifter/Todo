package com.kronos.plugins

import com.kronos.configureApi
import com.kronos.utils.TodoAuth
import com.kronos.utils.TodoConfig
import com.kronos.utils.TodoSession
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import org.koin.ktor.ext.inject
import java.io.File
import java.util.*

fun Application.configureSecurity() {
  val config by inject<TodoConfig>()
  val signKey = config.sessionSigningKey.let { Base64.getDecoder().decode(it) }
  val encryptionKey = config.sessionEncryptionKey.let { Base64.getDecoder().decode(it) }

  install(Sessions) {
    header<TodoSession>("x-session-id", directorySessionStorage(File("build/.sessions"))) {
      transform(
        SessionTransportTransformerEncrypt(
          encryptionKey = encryptionKey,
          signKey = signKey
        )
      )
    }
  }

  authentication {
    session<TodoSession>("todo-session") {
      validate { session ->
        session.auth
      }

      challenge {
        call.respond(UnauthorizedResponse())
      }
    }

//    basic("todo-basic") {
//      realm = "Kronos"
//      // TODO remove as soon as JWT is implemented
//      validate { credentials ->
//        if (config.devMode) {
//          val validHosts = setOf("localhost", "127.0.0.1")
//          if (request.origin.remoteHost.lowercase() !in validHosts) {
//            application.log.warn("Basic auth from remote addresses is not allowed in dev mode")
//            return@validate null
//          }
//        }
//
//        TodoAuth("123abc")
//      }
//    }

    //TODO implement JWT
  }

  configureApi {
    loginApi()
  }
}

private fun Route.loginApi() {
  // TODO refactor when JWT is implemented
  get("/login") {
    val session = TodoSession(TodoAuth(UUID.randomUUID().toString()))
    call.sessions.set(session)
    call.respondText("User logged in: ${session.auth.userId}")
  }

  get("/logout") {
    val user = call.sessions.get<TodoSession>()?.auth?.userId
    call.sessions.clear<TodoSession>()
    call.application.log.debug("User logged out: $user")
    call.respondText("User logged out: $user")
  }

  todoOptionalAuthentication {
    get("/check-auth") {
      val auth = call.principal<TodoAuth>()
      if (auth == null) {
        call.respondText(status = HttpStatusCode.Unauthorized) { "NO AUTH" }
      } else {
        call.respondText(status = HttpStatusCode.OK) { "AUTH: ${auth.userId}" }
      }
    }
  }
}

fun Route.todoAuthentication(build: Route.() -> Unit) {
  authenticate("todo-session", build = build)
}

fun Route.todoOptionalAuthentication(build: Route.() -> Unit) {
  authenticate("todo-session", optional = true, build = build)
}

package com.kronos.plugins

import com.kronos.utils.TodoConfig
import com.kronos.utils.TodoSession
import io.ktor.server.application.*
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
    header<TodoSession>("todo_session", directorySessionStorage(File("build/.sessions"))) {
      transform(
        SessionTransportTransformerEncrypt(
          encryptionKey = encryptionKey,
          signKey = signKey
        )
      )
    }
  }
  routing {
    get("/login") {
      call.sessions.set(TodoSession(id = "123abc"))
      call.respondText("Logged in\n")
//      call.respondRedirect("/todos")
    }

    get("/todos") {
      val session = call.sessions.get<TodoSession>()
      if (session != null) {
        call.respondText("Hello ${session.id}")
      } else {
        call.respondText("No session\n")
      }
    }

    get("/logout") {
      call.sessions.clear<TodoSession>()
      call.respondText("Logged out\n")
//      call.respondRedirect("/todos")
    }
  }
}

package com.kronos.plugins

import com.kronos.utils.TodoConfig
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.callloging.*
import io.ktor.server.plugins.compression.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import kotlinx.serialization.Serializable
import org.koin.ktor.ext.inject
import org.slf4j.event.*
import java.io.File

fun Application.configureServer() {
  val config by inject<TodoConfig>()
  install(Compression) {
    gzip {
      priority = 1.0
    }
    deflate {
      priority = 10.0
      minimumSize(1024) // condition
    }
  }

  install(CallLogging) {
    level = Level.TRACE
    filter { call -> call.request.path().startsWith("/api") }
    format { call ->
      "${call.request.httpMethod.value}: ${call.request.path()} -- ${call.response.status()}"
    }
  }

  install(StatusPages) {
    status(HttpStatusCode.NotFound) { call, _ ->
      val uri = call.request.uri
      if ("/api/" in uri) {
        return@status
      }

      // If in dev mode, find files in directory, otherwise, serve from resources
      if (config.devMode) {
        call.respondFile(File("src/main/resources/web/browser"), "index.html")
      } else {
        call.resolveResource("browser/index.html", "web")?.let { call.respond(it) }
      }
    }

    status(HttpStatusCode.Unauthorized) { call, _ ->
      if (config.devMode) {
        call.respondFile(File("src/main/resources/web/browser"), "index.html")
      } else {
        call.resolveResource("browser/index.html", "web")?.let { call.respond(it) }
      }
    }

    exception<Throwable> { call, cause ->
      call.application.log.warn("Unhandled error", cause)
      val message = cause.message ?: cause.javaClass
      call.respond(HttpStatusCode.InternalServerError, TodoError("Error: $message"))
    }
  }
}

@Serializable
data class TodoError(
  val message: String
)

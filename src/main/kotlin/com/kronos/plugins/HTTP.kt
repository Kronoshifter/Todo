package com.kronos.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import kotlinx.serialization.Serializable

fun Application.configureServer() {
  install(StatusPages) {
    status(HttpStatusCode.NotFound) { call, _ ->
      val uri = call.request.uri
      if ("/api/" in uri) {
        return@status
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

package com.kronos.plugins

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*

fun Application.configureSecurity() {

  data class UserSession(val id: String)

  install(Sessions) {
    cookie<UserSession>("MY_SESSION") {
      cookie.extensions["SameSite"] = "lax"
    }
  }
  routing {
    get("/session") {

    }
  }
}

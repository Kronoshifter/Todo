package com.kronos

import com.kronos.plugins.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import kotlinx.serialization.Serializable

fun main() {


  embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
    .start(wait = true)
}

fun Application.module() {
  configureHTTP()
  configureSecurity()
  configureSerialization()
  configureRouting()
}

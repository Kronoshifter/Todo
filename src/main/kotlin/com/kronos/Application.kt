package com.kronos

import com.kronos.plugins.configureSecurity
import com.kronos.plugins.configureSerialization
import com.kronos.plugins.configureServer
import com.kronos.api.configureTaskApi
import com.kronos.database.FakeTaskDatabase
import com.kronos.database.TaskDatabase
import com.kronos.utils.TodoConfig
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.netty.*
import io.ktor.server.routing.*
import org.koin.dsl.module
import org.koin.ktor.ext.inject
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger


fun main(args: Array<String>): Unit = EngineMain.main(args)

fun Application.core() {
  val configModule = module {
    single { TodoConfig(environment) }
    single { TaskDatabase() }
    single { FakeTaskDatabase(19551105) }
  }

  install(Koin) {
    slf4jLogger()
    modules(
      configModule
    )
  }

  configureServer()
  configureSerialization()
  configureSecurity()
  configureTaskApi()

  log.info("Server configuration complete, configuring web application")

  routing {
    singlePageApplication {
      val config by inject<TodoConfig>()
      application.log.trace("Devmode: {}", config.devMode)
      useResources = !config.devMode
      filesPath = if (config.devMode) "src/main/resources/web/browser" else "web/browser"
      defaultPage = "index.html"
      ignoreFiles { it.endsWith(".txt") }
    }
  }
}

fun Application.configureApi(build: Route.() -> Unit) {
  routing {
    route("/api", build = build)
  }
}

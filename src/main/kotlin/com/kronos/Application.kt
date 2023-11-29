package com.kronos

import com.kronos.plugins.configureServer
import com.kronos.plugins.configureRouting
import com.kronos.plugins.configureSecurity
import com.kronos.plugins.configureSerialization
import com.kronos.utils.FakeTaskDatabase
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

fun Application.module() {
  val configModule = module {
    single { TodoConfig(environment) }
    single { FakeTaskDatabase(19551105) }
  }

  install(Koin) {
    slf4jLogger()
    modules(
      configModule
    )
  }

  configureServer()
  configureSecurity()
  configureSerialization()
  configureRouting()

  routing {
    singlePageApplication {
      val config by inject<TodoConfig>()
      useResources = !config.devMode
      filesPath = if (config.devMode) "src/main/resources/web/browser" else "web"
      defaultPage = "index.html"
      ignoreFiles { it.endsWith(".txt") }
    }
  }
}

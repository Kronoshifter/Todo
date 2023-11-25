package com.kronos.utils

import io.ktor.server.application.*
import java.lang.IllegalStateException

class TodoConfig(private val environment: ApplicationEnvironment) {
  val sessionSigningKey by env("ktor.session.signingKey")
  val sessionEncryptionKey by env("ktor.session.encryptionKey")

  private fun env(path: String): Lazy<String> = lazy { environment.config.propertyOrNull(path)?.getString().orThrowMissing(path) }

  private fun <T> T?.orThrowMissing(path: String): T {
    if (this == null) {
      throw IllegalStateException("Missing configuration option: $path")
    }

    return this
  }
}



package com.kronos.utils

import io.ktor.server.auth.*

data class TodoSession(
  val auth: TodoAuth
)

data class TodoAuth(
  val userId: String,
) : Principal

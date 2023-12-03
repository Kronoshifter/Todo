package com.kronos.model

import io.ks3.java.time.InstantAsLongSerializer
import kotlinx.serialization.Serializable
import java.time.Instant

@Serializable
data class TodoTask(
  val id: String,
  val title: String,
  val completed: Boolean,
  val tags: List<String> = listOf(),
  val description: String? = null,
  @Serializable(with = InstantAsLongSerializer::class)
  val dueDate: Instant? = null,
//  val children: List<TodoTask>
)

